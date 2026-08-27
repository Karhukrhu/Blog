---
title: Bumpy Road of Installing 11ty
date: 2026-08-27
categories: ["website","coding", "blog"]
tags: post
---

For a few days now I've been struggling to deploy 11ty to my site. Eventually I got it working (maybe you can see that ;D)

There were problems right at the beginnig. I was able to install 11ty, but did it in a wrong folder and it all got messed up. The tutorial I was following can be found <a href="https://cfjedimaster.github.io/eleventy-blog-guide/guide.html" target="new">here</a><svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 21 21"
  fill="none"
  stroke="#000"
  stroke-width="1"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
  <path d="M11 13l9 -9" />
  <path d="M15 4h5v5" />
</svg>. It was of little help as I'm totally novice with terminal commands.

With a horrendous amount of iteration, trial and error, finetuning as well as getting used to new file formats, I managed to get some output of a raw page.

Then, even my English laguage skills were put to the test as I understood something totally wrong from the tut. And that, of course, broke the whole process again. Everytime I edited eleventy.config file, something went wrong. 

It took so much time trying to understand what went wrong and why. I was getting frustrated. I mean even the date format was giving me gray hair.

After all struggle with local server, it was time to get the creation online. For that I used GitHub's actions. Totally new thing to me as well. It didn't go smoothly.

The biggest problem turned out to be file paths. Despite using / and ../ and even ../../ I couldn't get the images and URLs direct to a right file. As I still don't. I'm forced to use absolute URLs because of the "complexity" of my file paths :'')

Aaand then GitHub went down. I had to wait even though I was getting excited instead of frustrated. The blog started to look like something!

Then something happened. Because of a human error (mine) the blog got directed to the root folder deleting all the pages, like about pages and guestbook. And they were gone.

Here I thank, for the first time ever, my cached site. I was able to fetch the source codes from those cached pages, So I could happily recreate all of them without contacting Nekoweb support.

As of today, I still don't know if my RSS works or not. That's something I need to test soon. Other than that, it's starting to look the way I want it to. Yay!