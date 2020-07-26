# Z&Z Roll 20 #

Character sheets for ZnZ

## About ##

Uses SCSS for styles.

Gulp file includes is used to include files.
- to build a preview html file
- break out script workers into other files


Gulp replacer to replace text/javascript with text/worker in dist.


All JS gets concatenated.


`gulp html` - HTML building

`gulp scripts` - JS concatenating

`gulp watch` - Watch for changes.

`gulp style` - build SCSS



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

