+++
title= "Neorg Is Changing The Way that I Think"
description= ""
authors= "Adam Kalinowski"
categories= [
"Neovim",
"Neorg",
"Hugo",
"Organization",
"Blog",
]
created= "2025-04-05T09:28:54-0500"
updated= "2025-04-05T19:29:23-0500"
+++

# Neorg Is Changing The Way that I Think 

According to my imposter syndrome, I am an inexperienced software engineer. Yet when I look back through out the years, I have been a software engineer for almost **Six years**. I began my journey as a student working on sorption simulations with large metal organic frameworks in a computational chemistry lab.
Now if you have ever worked on a supercomputer, you would know that you do not simply log onto a supercomputer ran by a university. You **ssh** into the server, and run your code in the terminal by starting a job. So when I began as a resarch student I would write my code and then scp the file to my home directory of my instance. This was awful. However a graduate student that I was working with suggested learning how to use vim. That way I could do my programming in vim on the server. 

## That was the beginning of the end

I became obssesed with vim, vim movements, and plugins. I started having a problem. I wanted to get more productive, more investigative, and more efficient. I became a vim evangelist and without me really realizing what was occuring; I was no longer a bright-eyed and curious physics major who wanted to do computational astrophysics. I began to love software. I began to realize that I can make my experience with my computer so much more intimate. A linux (Arch btw) install here. A small rewrite of my vim config to be a neovim version in lua there. Oh, one small colorscheme wont hurt anyone. I am learning Dvorak layout to help my rsi. This primeagen guy on youtube seems like a lot of fun, I am sure I am not going to develop an unhealthy relationship with Rust. Yeah I can justify buying a Moonlander keyboard. Oh there is no problem with building my own keyboard from scratch, right? One tiny dose of the vim drug turned me into somethig worse than a physicist. A Software Engineer. Vim: not even once. 

## How to rewire your brain 

Now as a Software Engineer starting a blog, I have a legal obligation to profess dogma of productivity. For my entire tenure of physics, I have been taking notes and studying topics to ad gnoscium. But once I became a software engineer this tool was put on the back burner. In College and working as a research student. I was using notebooks and binders for note taking. Notebooks or banders with blank sheets, worked perfectly well for me. Being able to split up ideas physically lead to serious compartmentalization. This blue notebook is for Linear Algebra. This book is for physics. This book is for research so on and so on. But once I started my professional career almost 4 years ago, I found that I was working with a computer was way more convienient to just take notes on my computer directly.

Taking my notes onto the computer lead me to a new question: How do I take notes on my computer? First I tried to use latex in Neovim. let me outline what I had to do in order to take notes with latex. 
1. I had to have neovim open in a terminal instance. 
2. I had to have a live compiler open in a seprate process so that I could have a live preview in another window.
3. A third window open so that I could remember all of the syntax for what I wanted. 
4. Finally I found that I had to then move the pdfs to diffenent directory.

It was absolute torture to just take notes and almost always found that writing notes was to much of a hassle to actually be organized. My productivity was handicapped at best, and comatose at worst. When writing software I was able to quickly spin up hundreds of lines of code. I began to wonder if there was a way that I could write my notes with just plain text.

   This was when I started using obsidian. Obsidian if you do not know, is primarily a desktop application that serves Markdown files in a pretty ui. But because of that I could use neovim to edit those files and then just use obsidian for the ui. This was great because I could install plugins, to enhance the experience. I could render Dungeons and Dragons stat blocks write inside my notes to quickly create dungeons for my home games. Icould take notes on programing concepts and refrece them. Then view all my mind map connections with the obsidian map functionality. This was a huge improvement in my note taking experience. All I had to remember was the markdown syntax to create deeply interactive notes.
   
   This was great, but then I heard about literate programing. In Emacs, there is a plugin called orgmode. It allows for being able to take notes, make lists, and so much more. When I saw this, I think I said "Wow that is super cool, but I already have that in obsidian. But then I saw a video by [Distro Tube](https://www.youtube.com/watch?v=eF4cJlBNtdQ) and this single video changed, something ringed in my ears. I could create my configs with emacs. And have so much more by the end of it. So I gave Emacs a try for about 1-2 weeks. True I can recognize that that was not enough time to make a firm conclusion. But, I wrote my code in exclusively in emacs, and I liked it for the most part. The pnemonics were so easy. I recognized alot of the same type of plugins that were in neovim were in neovim, e.g. whichkey. However what I did not like was that the movements were different enuogh from vim that I ultimately decided to go back to neovim. So then I tried to do the smarter thing, and what I probably decided to do in the first place: I tried Neorg.

## Neorg: My St. Paul moment

When I found out about Neorg I was imediately amazed by the absolute span of functionality present in the plugin already. 
- Todo Lists were already implemented 
- An exporting feature was already implemented for markdown. (Turn your .norg files into .md files, and you can use them for a blog or something.) 
- Generating Headers behind a keymap if so desired.  
- And Tangleing 

Tangeling is the real interesting part here. Tangleing is a feature that allows for literate configs and literate programming in neovim. Literate Programing is a programming paradigm introduced in 1984 by Donald Knuth in which a computer program is given as an explanation of how it works in a natural language, such as English, interspersed (embedded) with snippets of macros and traditional source code, from which compilable source code can be generated.  The approach is used in scientific computing and in data science routinely for reproducible research and open access purposes. _(sourced from wikipedia)_

  And Literate Configs are just the same thing. You explain why you are configuring something to be a certain way rather than just setting it. It helps when you forget why you set something; rather than removing said config setting, you just look as to why you set it in the first place and dont have to solve the problem again. 

## What is the result?

To be honest, my biggest take away is that the being able to take notes, write my configs, and record my thougts in a journal all in the editor that I feel I am most proficient has really made me feel like I am growing as a software engineer more and more. And now it is also motivating me to start this blog that you are already reading. 
