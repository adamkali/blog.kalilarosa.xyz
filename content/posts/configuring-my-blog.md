---
title: configuring-my-blog
description: "A quick writup on how I started to configure my blog for my own happiness."
author: AdamKalinowski
date: 2025-04-08T06:55:50-0500
lastMod: 2025-04-10T15:37:59-0500
version: 1.1.1
---

When a developer starts a new website, there are two events that occur. The developer will beset by horrific nightmares about styling the website. The other event is that the developer has fantastic dreams about how much better than they actually are about writing css. So when I saw that this website deployed on my [Coolify](https://coolify.io/docs/) instance did not have any styles what so ever even though locally I saw the styles. You know that I had to roll up my sleeves and just start making custom to my own.


# The problem 

Currently I am using `hugo server` to generate my static site. And also I downloaded the `not-much` theme to use when styling. I liked the look of it and i was happy to leave it as the theme. But as I said before, when deployed to my server the site did not produce the css that I was expecting. So rather than trying to deepdive on why someone's code was not working; I opted to trying to produce my own theme and learn how the theme-ing works in hugo. 
Looking at the docs, this is done with the following:  
- Writing HTML files inside of the `/layouts/` directory with go's `html/template` package to define the structure of the blog.
- Writing css files inside of the `/static/` directory to style the HTML files. 


# The investigation 

First thing is first. I need to nuke the styling of the local copy of my blog. This will give me a good baseline of where to start with styling and try to isolate the problem as best I can. To do this, I decided to pull all of the templates from the not much theme and removed all styling from the templates. Then loaded them into my own layouts directory. This brought me to just using a bare template with image.  
The next thing that i wanted to do was to build out my styling. Now I have mostly used styling libraries to make styling with websites. I love tailwind, and i think that it is a great tool if you favor if you want a nice rule set for creating a good brand identity. That being said, I still feel handicapped in the fact that while I know about css, and I am comfortable with writing it. Sure, I have configured css when needed for widgets on certain window managers in linux. But not for a website explicitly. So since this is just my blog; I thought this would be the best chance to get really good at CSS proper. 
I pulled in reset.css 
```css
/* http://meyerweb.com/eric/tools/css/reset/ 
v2.0 | 20110126
License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
margin: 0;
padding: 0;
border: 0;
font-size: 100%;
font: inherit;
vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
display: block;
}
body {
line-height: 1;
}
ol, ul {
list-style: none;
}
blockquote, q {
quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
content: '';
content: none;
}
table {
border-collapse: collapse;
border-spacing: 0;
}
``` 
Why? Well, I would like you take a look at [this post](https://meyerweb.com/eric/thoughts/2007/04/18/reset-reasoning/)


