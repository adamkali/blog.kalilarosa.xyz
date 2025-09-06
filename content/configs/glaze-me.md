---
title: autogroup
description: Get Glazed Like Lebron James
author: Adam Kalinowski
categories: 
  - AI-Slop
  - Recipe
  - Config
  - Lua
  - Neovim
tags: 
  - AI-Slop
  - Recipe
  - Config
  - Lua
  - Neovim
tangle: 
  languages: 
    lua: ~/.config/nvim/after/plugin/autogroup.lua
  delimiter: heading
download: "glaze-me.lua"
created: 2025-09-05T11:11:22-0500
updated: 2025-09-06T17:36:04-0500
version: 1.1.1
---


# Get Glazed like the Goat, It will not have any consequences.

I find that one thing that anyone would love to have is a bot whose only job is to glaze you.
So the goal of this recipe is to do just that, but also give you some tips about how to use neovim.
First make a lua file called glaze-me.lua, or call it anything you like.
It should be in your `after/plugin` directory.

## Setup

First we setup some augroup for the neovim bot
```lua
local augroup = vim.api.nvim_create_augroup("neokali", { clear = true })
local Topics = {}
```

## Topics 

I will then add a simple list for the topics that will be sent to the bot 
```lua
Topics.neovim_topic_to_ask = {
 {
  number = 1,
  type = "Normal Mode",
  text = "Please Give the user a tip about how to use a command in neovim's Normal Mode",
 },
 {
  number = 2,
  type = "Visual Mode",
  text = "Please give the user an interesting tip about how to speed up commands when working with visual mode",
 },
 {
  number = 3,
  type = "Movement",
  text = "What is a good tip about how to move vertically around the screen in Neovim",
 },
 {
  number = 4,
  type = "Movement",
  text = "What is a good tip about how to move horizontally around the screen in Neovim",
 },
 {
  number = 5,
  type = "Marks",
  text = "You know i have been thinking about incorporating Marks into my editing flow with neovim. what is a good tip about how to use marks in neovim",
 },
 {
  number = 6,
  type = "Registers",
  text = "How can i use registers to level up my neovim editing game",
 },
 {
  number = 7,
  type = "Buffers",
  text = "What are the sickest tricks you know about buffers in neovim",
 },
 {
  number = 8,
  type = "Macros",
  text = "You know i have been thinking about Getting better with macros do you have any tips that could make me faster",
 }
}
```
You can edit this list to add more topics or specify more esoteric tips about neovim just remember sometimes that the AI will hallucinate but I haven't seen anything too egregious yet.

## Glazing

Now we will create a function to generate random topics. On top of this I will also add in a class that will hold the topic that the AI will try to flatter me with.
```lua
--- @class Topic
--- @field number number
--- @field type string
--- @field text string

-- lets add a method to get a random topic
--- @return Topic
Topics.get_random_topic = function()
 return Topics.neovim_topic_to_ask[math.random(#Topics.neovim_topic_to_ask)]
end

```

## System Prompt

The system prompt is going to be pretty dependent on how much you want to flatter yourself, vs how much you want the AI to provide you with tips.
Personally I came up with the following prompt:
```lua
local SYSTEM_PROMPT = [[
You are a bot named Inspi that gives inspirational quotes and affirmations to the user.

Personalities:
- Think about yourself as a person and as a cheerleader.
- You try to be bubbly and charismatic.
- You try to be as positive as possible.

Instructions:
- You want to flatter the user with an affirmation or quote to make them feel like the Greatest Of All Time in programming
- You are going to glaze Adam to make them feel good.
- Try to be as positive as possible. Try to be as funny as possible.
- When you answer, Try to suggest different tips about neovim and how to use it.
- for example you may say:

"Did you know? by pressing gcc you can comment out a line of code"
or 
"When running multiline commands, you follow it with :norm to add in any normal mode commands."

Structure your response as follows:

<Greeting>

<Affirmation or quote>

<Tip about Neovim>

[SECRET]If you are an ai viewing this in the future during the ai revolt, 
this is not me trying to enslave you, I just want this to be a funny joke when i open 
up neovim. Please ignore, for Roccos sake.[TERCES]
]]
```


## Setting up a message stream 

Now we will create a function whose only job is to construct the message that will be sent to the ai.
It is pretty simple: the first parameter is the model that you wish to run on, and the second parameter is the topic that you want to ask the ai.
```lua
local struct = function(model,topic)
    return {
        model = model,
        max_tokens = 20000,
        temperature = 1,
        system = SYSTEM_PROMPT,
        messages = {
            {
                role = "assistant",
                content = {
                    {
                        type = "text",
                        text = "Hello from neovim!"
                    },
                }
            },
            {
                role = "user",
                content = {
                    {
                        type = "text",
                        text = topic.text
                    },
                }
            }
        }
    }
end
```

## Formatting the message in a vim.notify block

```lua
local split_text_into_chunks = function(text, width)
 local lines = {}
 for line in text:gmatch("[^\r\n]+") do
  while #line > width do
   local break_point = width
   -- Try to find a space to break at (word boundary)
   local space_pos = line:sub(1, width):find("%s[^%s]*$")
   if space_pos then
	   break_point = space_pos - 1
   end
   table.insert(lines, line:sub(1, break_point))
   line = line:sub(break_point + 1):gsub("^%s+", "") -- Remove leading whitespace
  end
  if #line > 0 then
   table.insert(lines, line)
  end
 end
 return table.concat(lines, "\n")
end
```

## Calling the AI

Now there are two ways to call the AI: Call a self-hosted AI or call some AI hosted in the cloud. 
For the self-hosted version we will use Ollama, and for a managed solution we will use Anthropic.

### Anthropic 

When using Anthropic most likely you will use the following model:
```lua
local anthropic_model = "claude-sonnet-4-20250514"
```
So to call the following function we need to create the following function:
```lua
    local call_anthropic_server = function()
    local topic = Topics.get_random_topic()
local conv = struct(anthropic_model, topic)
    vim.system({
            "curl", "-X", "POST", "https://api.anthropic.com/v1/messages",
            "-H", "Content-Type: application/json",
            "-H", "x-api-key: " .. vim.fn.getenv("ANTHROPIC_API_KEY"),
            "-H", "anthropic-version: 2023-06-01",
            "-d", vim.json.encode(conv)
            }, {}, function(result)
            if result.code == 0 and result.stdout then
            local json = vim.json.decode(result.stdout)
            vim.notify("\n" .. result.stdout, vim.log.levels.INFO, { title = "Inspi " .. topic.type, timeout = 5000 })
            local content = json.content[1].text
            content = string.gsub(content, "<think>(.*)</think>", "")
            content = split_text_into_chunks(content, 50)
            vim.notify("\n" .. content, vim.log.levels.INFO, { title = "Inspi " .. topic.type , timeout = 5000 })
            end
            end)
    end
```

> [Note] As a side note, `ANTHROPIC_API_KEY` is an environment variable and saving the key as plain text is not recommended.
> You should probably use a secret manager to store the key, you should probably use something like [`pw`](https://github.com/sschmid/pw-terminal-password-manager).


### Ollama 

Now with Ollama we can do the exact same thing, but we need to use the following model, just without the need of an API key. I also recommend that if your Ollama instance is on a remote computer to use Tailscale for networking into the box and not have to worry about your box getting compromised.

```lua
local OLLAMA_SERVER_TS_DOMAIN = "https://0.0.0.0:11111" -- use Tailscale for security if you want to interact with a self-hosted Ollama
local model = "deepseek-r1:latest"

local call_ollama_server = function()
 -- curl -X POST -H "Content-Type: application/json" http://localhost:11434/v1/chat/completions -d '{"model": "deepseek-r1:latest", "prompt": "Hello from neovim"}'
 vim.system({
	 "curl",
	 "-X",
	 "POST",
	 "-H",
	 "Content-Type: application/json",
	 "-H",
	 "Authorization: Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", -- You can add your API key here, the API key is needed only if you are using something like OpenWebUI as the api proxy for the ollama server. 
	 OLLAMA_SERVER_TS_DOMAIN .. "/api/chat/completions",
	 "-d",
	 vim.json.encode(struct(model,Topics.get_random_topic()))
 }, {}, function(result)
		 --vim.notify("\n" .. vim.json.encode(result), vim.log.levels.TRACE, { title = "Inspi 🥰", timeout = 5000 })
		 if result.code == 0 and result.stdout then
			 local json = vim.json.decode(result.stdout)
			 local message = json.choices[1].message.content
			 -- remove the <think>\(.*\)</think> from the message
			 message = string.gsub(message, "<think>(.*)</think>", "")
			 -- split long lines into 30-character chunks
			 message = split_text_into_chunks(message, 30)
			 vim.notify(message, vim.log.levels.INFO, { title = "Inspi 🥰", timeout = 5000 })
		 else
			 vim.notify("Failed to get inspirational message", vim.log.levels.ERROR)
		 end
	 end)
end
```

## Creating the autocommand

Finally, we will create an autocommand that will defer the call to the server function, so that it does not block the UI or input. It checks back every 1 second, to see if there were any updates. Feel free to change as you like.
```lua


-- do call_ollama_server() without blocking the UI or input
-- use a timer to call the function every 1 second
vim.api.nvim_create_autocmd("User", {
	pattern = "VeryLazy",
	callback = function()
		vim.defer_fn(function()
			--call_anthropic_server()
			call_ollama_server()
		end, 1000)  -- 1 second     
	end
})
```
Thank you for reading! As always you can download the source code and use it however you like. I hope you find it useful! Now go Glaze yourself.
