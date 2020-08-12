# Z&Z Roll 20 #

This project builds a custom character sheet for a homebrew tabletop RPG system for use on Roll20. To build a custom sheet, you must have a Pro-level account on Roll20 with access to the Script API.

While all of this was built in order to create a homebrew system, what's more important to notice is that this is a foundation for a sheet-generator system, similar to a static site generator. This was not an intentional design from the beginning, but ended up happening over time as I encountered annoyances in typical HTML building.


## Character Sheet Fields ##

Roll20 uses typical HTML/CSS for building character sheets. This has the caveat of all sheets being just one big HTML file. Naturally, this becomes very big and unwieldy to manage if you have tons of fields in your character sheet.

This project attempts to alleviate this with a build process. Instead of defining fields inside a HTML field, the creator defines them with JSON files which then get fed into a series of templates which are then compiled into the character sheet.

By using JSON to define the fields, you gain some benefits:

- Portability of data
- Ease of reuse in other parts of the sheet or API scripts
- Not having to constantly sift through a thousands-line HTML file to remember what you called this one field.
- You can use the JSON to populate a static site, allowing you to easily create a game handbook or rulebook website. 
- A single source of truth to all fields, which can be referenced and used throughout the sheet, sheet workers, and API scripts.
- Ability to use different HTML templaters as you see fit. 


## Build Process ##

The whole sheet-generating process is facilitied through Gulp - https://gulpjs.com/. A series of Gulp plugins is used to build this task.

For this particular system, we use Nunjucks https://mozilla.github.io/nunjucks/ to template the HTML for our character sheet.

Styles are built using SCSS https://sass-lang.com/

Data is fed into the Nunjucks templater via gulp-data. You can refer to the gulpfile for more details. 

## Prerequisites ##

1. Node
2. NPM


Once you have those installed globally, run `npm install` in order to install the dependencies. This should install Gulp and other Gulp plugins. 


## Data ##

Sheet Field Data is defined in a series of JSON files in data. 

## About ##

Uses SCSS for styles. Nunjucks for Templating

All field data should be defined in the data folder.

Data and any data queries are retrieved and imported into nunjucks-render for use in template.

Gulp handles the build process.

`gulp sheet` - Build the template and all sheet workers into /sheet

`gulp style` - build SCSS in /sheet

`gulp watch` - Watch for changes in styles, templates, and data.


## Sheet Workers ##

Each Sheet workers must be added to sheet-workers in their own directory.

The code for the worker should be in a file named worker.js

If it needs data from the Data Store, add an import.js file. This file should export any needed data for the worker.

Use '[[data]]' as a placeholder variable for data.

The Gulp Process has a complicated way to import the data and include it into the main sheet html

1. Looks for all sheet-workers/*/worker.js
2. Sees if there is also an import script in the same directory. If so, requires() that script to import the data.
3. Streams the worker.js and replaces any '[[data]]' text in the worker script with the imported data.
4. Uses gulp inject to inject it in the specified location in the template. 


## Data Querying ##
Sometimes you'll need specific data from a json file and not the raw json.

So we query using JS. 

Gulp looks at any JS files in the query folder. Each file should export a JSON struct. 

Then Gulp pipes that into the data stream with gulp data which then gets fed into the tempaltes

