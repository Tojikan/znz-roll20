# Roll20 Static Sheet Generator (SSG) #

This is a repo to document and explain my build process to generate files for a custom Roll20 Character sheet. I use this process to make creating custom sheets faster, more maintainable, and automated.

This may be difficult if you do not come from a developer background. I recommend understanding the following concepts:

- HTML
- CSS
- JS
- CSS Pre-processors
- HTML Templating Engines,
- Node.js



## Introduction ##

This build process helps makes creating custom character sheets easier. Here's what it does:

- Builds HTML from [Nunjucks](https://mozilla.github.io/nunjucks/) templates, letting you use an HTML templating language for way easier markup creation and the ability to use logic to write markup.

- Compiles [SASS/SCSS](https://sass-lang.com/) into CSS, making it breeze to write your styles

- Concats all of your Sheet Workers to a template at a predetermined location. You can write your sheet workers as pure JS files and the process will automate adding it to your final sheet HTML!.


But wait there's more! Are you sick of the fact that your character sheet properties are just IDs on a HTML form element? Making it really, really hard to manage and maintain?

```
Your Character's attributes:
<input type="text" name="attr_strength" value="25"/>
<input type="text" name="attr_intelligence" value="25"/>
<input type="text" name="attr_dexterity" value="25"/>
<input type="text" name="attr_charisma" value="25"/>

```



Well this process allows you to define your sheet properties through a simple JSON! Simply define your character's properties in JSON and the build process will feed it through to the Nunjucks template renderer so you can use it in your templates as variables. 



Okay that's great for your templates, but how about your API scripts and your Sheet Workers? Can those also consume the data? Yes, they can! The build process runs a text replacement function in order to directly inject your data into your JS files! So you can truly define all of your character properties in a single file and have it build out your sheet accordingly!

