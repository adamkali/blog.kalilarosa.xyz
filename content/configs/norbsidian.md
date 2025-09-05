---
title: norbsidian
leader: So here is a really cool script that you should try if you want to integrate your neorg notes with obsidian, or maybe you want to use your neorg notes in a documentation on github. 
author: Adam Kalinowski
categories: 
  - Config
  - Lua
  - Neovim
  - Neorg
  - Recipe
tangle: 
  languages: 
    lua: ~/.config/nvim/lua/norbsidian.lua
  delimiter: heading
download: "norbsidian.lua"
created: 2025-09-04T23:59:05-0500
updated: 2025-09-05T08:57:56-0500
version: 1.1.1
---


# This Is some expert tier exporting

So one thing I had a problem with is getting my neorg notes to export to obsidian without manually having to specify the directory that it will be exported to. So here is a recipe for a script that I wrote for my neovim config that does just that. 


## Pragma

We start offcreate some tables and load in some libraries 
```lua
local norbsidian = {}
local builtins = require("telescope.builtin")
local pickers = require("telescope.pickers")
```



## I am now going to define this here class and function 

Now the NorbOptions class is a secret mousekatool to use later more on that later, but the norbsidian_export_template function just takes the inputs and gives us a pure function that will always generate the proper export.
```lua
---@class NorbOptions
---@field name string
---@field dir string must be the absolute path, no trailing slash | default: $HOME
-- make this next on optional
---@field env string nil must be a env_var that points to the directory, no trailing slash | default: $HOME
---

--- @param loc string
--- @return filename string
local function norbsidian_export_template(loc, filename)

 filename = loc .. filename .. ".md"
 return "Neorg export to-file " .. filename .. " markdown"
end
```



## Telescope 🥰

Alright so now this is another function that will give a nice gui to choose a Norb to export our neorg file. dont worry we are getting there 
```lua
norbsidian.telescope = function(selections, callback)
 assert(#selections > 0, "No selections provided") -- Ensure there are selections

 local pickers = require('telescope.pickers')
 local finders = require('telescope.finders')
 local conf = require('telescope.config').values
 local actions = require('telescope.actions')
 local action_state = require('telescope.actions.state')

 local opts = {}
 pickers.new(opts, {
  prompt_title = "Select a Export local",
  finder = finders.new_table {
   results = selections,
   entry_maker = function(entry)
	   return {
		   value = entry,                                  -- <-- -----------------\
		   display = entry.name,                           -- SAME THING            |
		   ordinal = entry.name,                           -- /--------------------/
	   }                                                   -- |
   end                                                     -- |
  },                                                          -- |
  sorter = conf.generic_sorter(opts),                         -- |
  attach_mappings = function(prompt_bufnr, _map)              -- |
   actions.select_default:replace(function()               -- |
	   local selection = action_state.get_selected_entry() -- |
	   actions.close(prompt_bufnr)                         -- |
	   callback(selection.value)
	   --               ^\____________________________________/
   end)
   return true
  end,
 }):find()
end

```


## NORBS 👹

this is where you can add any amount of locations for you to export to. Give the name something recognizable and the directory the absolute path.
```lua
---@field Norbs table
norbsidian.Norbs = {
 {
  name = "Blog Posts",
  dir = "/home/adamkali/git/blog.kalilarosa.xyz/content/posts/",
 },
 {
  name = "Blog Configs",
  dir = "/home/adamkali/git/blog.kalilarosa.xyz/content/configs/"
 },
 {
  name = "Dailies",
  dir = "/mnt/c/Users/adam/Documents/notes/My_Second_Mind/05-Dailies/",
 },
 {
  name = "Work",
  dir = "/mnt/c/Users/adam/Documents/notes/My_Second_Mind/09-Work/",
 },
 {
  name = "Mindspace Docs"
 },
 {
  name = "Egg Cli Docs",
  dir = "/home/adamkali/projects/egg_cli/docs/"
 },
 {
  name = "Dotnvim Docs",
  dir = "/home/adamkali/git/dotnvim/docs/"
 }
}
```


## The Export Function

Now we are going to define the export function that will call our pure norbsidian_export_template function.
Right now i have it configurable to have either a directory or an env variable.
However, I am sure you can see if you are using multiple computers you can define env variables on each computer and just point to the right location. This excersise is left to the reader ;)
Or if neither are defined, just export the norg file to home.
We use the secret mousekatool: NorbOptions, to get some intellisence when writing out the function. 
```lua
---@param selection NorbOptions
norbsidian.export = function(selection)
 local filename = vim.api.nvim_buf_get_name(0)
 filename = string.sub(filename, 1, string.len(filename) - 5)
 local filename_path = vim.split(filename, "/")
 filename =  filename_path[#filename_path]
 -- vim.notify("Selected: "..vim.json.encode(filename_path) , vim.log.levels.TRACE, { title = "Norbsidian", timeout = 1000 })
 if selection.dir then
  norbsidian.export_loc = norbsidian_export_template(selection.dir, filename)
 elseif selection.env then
  norbsidian.export_loc = norbsidian_export_template(os.getenv(selection.env), filename)
 else
  vim.notify("No dir or env provided: Defaulting to $HOME", vim.log.levels.WARN, { title = "Norbsidian", timeout = 1000 })
  norbsidian.export_loc = norbsidian_export_template(os.getenv("HOME"), filename)
 end
 if norbsidian.export_loc then
  vim.cmd(norbsidian.export_loc)
 end
end
```


## The Thing you call from a keybind

Okay so this is the function that will be called from a keybind, and then those other functions and one we have not met yet will be called. Get the selections an then the function callback will do the exporting!
```lua
norbsidian.get_selections = function()
 norbsidian.telescope(norbsidian.Norbs, function(selection)
  norbsidian.export(selection)
 end)
end
return norbsidian
```


## Where do we put this file? 

If you use the current standard for neovim configuration, you should have some form of this directory structure in you neovim config. You can just put it in the lua folder so that you can load the functions in a keymaps.lua in the after folder.
``` bash 
  after/
   plugin/
        󰣙 keymaps.lua 
  lua/
      plugins/
    󰣙 norbsidian.lua # Put here
󰂺  README.md
󰣙  init.lua
```
And here is an example of how you would call the function from a keybind. 
``` lua
local wk = require('which-key').add
local neorg_leader = "<space>n"
-- ... 
wk {
 { neorg_leader, expr = false, group = "[N]eorg", nowait = false, remap = false, icon = { icon = "", "@constructor.tsx" } },
 -- ...
 { neorg_leader .. 'e', require('norbsidian').get_selections, desc = "neorg configured export" },
}
-- ...
```


Try it out and let me know what you think! email me, or make an issue on this [repo](https://github.com/adamkali/blog.kalilarosa.xyz) if you have any questions!
