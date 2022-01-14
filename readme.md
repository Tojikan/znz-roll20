# Roll20 Static Sheet Generator #

**This is a complete rebuild using Webpack, ES6, and React for static templating, Work in Progress** 

`npm run dev`
`npm run build`



This is a custom build process for creating a custom Character Sheet in Roll20. In this process, we define our character sheet fields using JSON and JS to generate a "Model" of our sheet. This lets us define field attributes and properties in native JS and keeps it separate from our Markup. Then we can put this through an HTML Templater to generate our markup and a JS Bundler to bundle it up so we can reference these properties in our scripts and sheet workers.

This may be difficult if you do not come from a developer background as you will need to understand the following concepts:

- Node
- ES6
- HTML Templating
- HTML Templating Engines
- CSS and CSS Pre-processors



## Quick Overview ##


If you want a detailed explanation, continue reading through the rest of the readme. If you want to get started right away, here's an outline of what the process does.


- Bundles up all our JSON and JS files in the `model` folder.
- Builds HTML from Nunjucks templates after feeding in our model.
- Handles injecting workers into our HTML
- Injects SASS variables into our SASS file.
- Builds CSS from SASS files
- Bundles our API Scripts into a single file for quick uploads.

Source files `src` and will be output to `dist`.


Additionally the Repo is setup to build a website through [Github Pages](https://docs.github.com/en/pages), allowing you to make your own little website for your character sheet. I find this is very helpful if you're making a homebrew system as a way to publish your game rules.

An additional optional build process will copy over all files in `data` over to `docs` so you can reference your data in your Github Page. See the section on "Github Page" for more information.



## Installation and Dependencies ##

This repo requires the following to be installed on your machine:

- Node.js
- NPM
- [Gulp](https://gulpjs.com/) CLI (v4+)

Run `npm install` to install gulp and all of the necessary gulp plugins and other dependencies.

By default, this repo utilizes [Nunjucks](https://mozilla.github.io/nunjucks/) as a templating engine and [SASS](https://sass-lang.com/) for CSS Pre-processing. There's no reason you can't replace it with your own preferred choices, but you'll have to be comfortable modifying the Gulp File to suit your needs.



## Build Commands ##

Run these commands in the root of the folder to start the build process.

`gulp sheet` - Builds your HTML from any *.njk files in the root of `src/templates` and outputs it to `dist`. Will also inject any JS files in `src/workers` into your template.

`gulp scripts` - Builds your JS from any *.js file in `src/scripts` and outputs it to `dist`

`gulp style` - Builds your CSS from any *.js file in `src/scripts` and outputs it to `dist`

`gulp build` - Does all of the above in one swoop.

`gulp watch` - Watches any changes to files and runs the build automatically.

`gulp docs` - Clears `docs/data` and copies all JSON files in `data` into `docs/data` for use in a Github page.


## BuildContext and Model ##

BuildContext.js contains all of the necessary code that retrieves our data model and add it into the build process.


The Model is built by requiring all files in the model folder and is returned as an object contain.

JSON files are included in the model using the filename as akey. JS Exports work a bit differently - only a Fields or Options export is included in the final Model.


## Background ##

Typically, a custom Roll20 Character Sheet consists of HTML, CSS, and optional JS for Sheet Workers and API scripts. A Character's "fields" are usually defined as a name attribute in your HTML like so:


```
<!-- Your Character's attributes -->
<input type="text" name="attr_strength" value="10"  max="20"/>
<input type="text" name="attr_intelligence" value="10" max="20"/>
<input type="text" name="attr_charisma" value="10" max="15"/>
```

This is tedious and hard to maintain later on as your sheet grows larger. Instead of storing your fields in raw HTML, what if instead you could write out character properties using JSON or JS like so:

```
data.json
{
    attributes: {
        strength: {
            default: 10,
            max: 20
        },
        intelligence: {
            default: 10,
            max: 20
        },
        charisma: {
            default: 10,
            max: 15
        }
    }
}
```

And then use a HTML templating language of your choice to output your fields consistently. 

```
{# Using Nunjucks for templating here #}

{% for name, item in data.attributes %} 
    <input type="text" name="attr_{{name}}" value="{{item.default}}" max="{{item.max}}">
{% endfor %}
```

This way, we can separate our presentation (the HTML) from our data model. This removes the tedium of going through an enormous HTML file to find or tweak an attribute. Now we have an exportable and reusable data model for our character sheet.

In addition, we can reference these fields in Sheetworkers and Custom API Scripts. Through ES6 imports and a JS bundler, our data model is bundled into our sheet worker and JS files so you can reference your fields all you want. Modifying your data model now affects both your HTML and your Scripts without the hassle of going through both.



## Unit Testing ##

Tests are run using Mocha.js

Any tests can be placed in the `test` folder.

Run tests with `npm test`

Run individual tests with `npm test -- -g {test name}`