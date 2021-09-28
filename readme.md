# Roll20 Static Sheet Generator #

This is a custom build process to generate a custom Character Sheet in Roll20 and streamline the whole process of building character sheets. In this process, we define our sheet fields in a separate data source, put it through a templating engine to generate the final markup, and then build our styles using modern CSS pre-processing.

This may be difficult if you do not come from a developer background as you will need to understand the following concepts:

- HTML
- CSS and CSS Pre-processors
- JS & JSON
- HTML Templating Engines
- Node.js


If you want a detailed explanation, continue reading through the rest of the readme. If you want to get started right away, here's an outline of what the process does.

- Reads all JSON files in the `data` folder, and custom user-defined functions in `_funcs.js` and `_reusables.js` and feeds it into the build pipeline.
- Builds HTML from Nunjucks templates
    - Feeds JSON data into the Nunjucks engine so your template can use it.
    - Evals any JS statement between `(([[  ]]))` and replaces the whole statement and wrapper with its return value.
    - Injects any JS files in `src/workers` directly into your HTML in between `/** inject:workers**/` and `/** endinject **/`.
    - Replaces `text/javascript` with `text/worker`. 
    - Removes empty lines
    - Minimizes HTML if building for production.
- Builds CSS from SASS files
- Minifies CSS if building for production
- Goes through all JS files in `src/scripts` and runs the eval/replace on statements between `(([[  ]]))`. 

Source files goes into `src` and will be output to `dists`.


Additionally the Repo is setup to build a website through [Github Pages](https://docs.github.com/en/pages), allowing you to make your own little website for your character sheet. I find this is very helpful if you're making a homebrew system as a way to publish your game rules.

An additional optional build process will copy over all files in `data` over to `docs` so you can reference your data in your Github Page. See the section on "Github Page" for more information.



## Installation and Dependencies ##

This repo requires the following to be installed on your machine:

- Node.js
- NPM
- [Gulp](https://gulpjs.com/) CLI (v4+)

Run `npm install` afterwards to install gulp and all of the necessary gulp plugins and other dependencies.

By default, this repo utilizes [Nunjucks](https://mozilla.github.io/nunjucks/) as a templating engine and [SASS](https://sass-lang.com/) for CSS Pre-processing. There's no reason you can't replace it with your own preferred choices. but it would require you to have familiarity with Gulp and customizing the Gulpfile.



## Build Commands ##

Run these commands in the root of the folder to start the build process.

`gulp build` - Builds your HTML, CSS, and JS into `dist`. Minifies CSS and HTML.

`gulp develop` - Builds your HTML, CSS, and JS into `dist` without minification.

`gulp watch` - Watches any changes to files and runs the build.

`gulp docs` - Clears `docs/data` and copies all JSON files in `data` into `docs/data` for use in a Github page.


You can also run any part of the process separately.


`gulp sheet` - Builds your HTML from any *.njk files in the root of `src/templates` and outputs it to `dist`. Will also inject any JS files in `src/workers` into your template.

`gulp scripts` - Builds your JS from any *.js file in `src/scripts` and outputs it to `dist`

`gulp style` - Builds your CSS from any *.js file in `src/scripts` and outputs it to `dist`

`gulp minifyHtml` - Runs HTML minification on HTML files in `dist`

`gulp minifyCss` - Runs CSS minification on CSS files in `dist`


## Background ##

Typically, a custom Roll20 Character Sheet consists of HTML, CSS, and optional JS for Sheet Workers and API scripts. A Character's "fields" are usually defined as a name attribute in your HTML like so:


```
<!-- Your Character's attributes -->
<input type="text" name="attr_strength" value="10"  max="20"/>
<input type="text" name="attr_intelligence" value="10" max="20"/>
<input type="text" name="attr_charisma" value="10" max="15"/>
```

This is tedious and hard to maintain later on as your sheet grows larger. Instead of storing your fields in raw HTML, what if instead you could write out character properties using JSON or some other interchangeable data format like so:

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

This way, we can separate our presentation (the HTML) from our data (the field JSON). Now, if you need to make changes to all of your attributes fields, you only need to change it one location. If you need to tweak your character fields, you could just modify your JSON, run the build process, and generate a sheet without ever having to touch raw HTML. Now that your field data is separate from the markup, you can do a whole lot more with it.

What if you want to reference a field in your custom Sheet Workers or API Scripts? This build process also has a replacement feature where it will evaluate JS statements and replace them with their result so you can directly reference your JSON in your JS files.

```
// By default, the process uses  (([[    ]])) as an indicator for when it should do a eval and replace on a JS statement. Anything within (([[   ]])) will get evaluated and replaced
var strengthMax = (([[data.attributes.strength.max]])); //We can define our own functions

...

//After the build process, will look like this:
var strengthMax = 20;
```

Now we can use our field data in multiple locations, making it far easier to streamline the process of making Scripts for our sheets. Not only that, we can even make our own custom functions to apply changes to JSON data that we import at build time. See the "Funks" section for more information.

Of course, the Build Process also includes steps for building styles, JS, etc. So in addition to the above, the process will make creating custom sheets easier by:

- Compiles [SASS](https://sass-lang.com/) into CSS, making it breeze to write your styles

- Takes all of your Sheet Workers and injects it directly into your Sheet HTML at any location you choose (using `/** inject:workers **/` and `/** endinject **/` as markers to denote where to inject). You can write your sheet workers as pure JS files and the process will automate adding it to your final sheet HTML!.

- You can write functions to be used in multiple API scripts and use the replacement function to inject the functions as pure strings into your API Script.

- Copies over your data into a docs folder so you can use it in your very own Github Page.



## Funks ##





## Unit Testing ##

Tests are run using Mocha.js

Any tests can be placed in the `test` folder.

Run tests with `npm test`