# Static Sheet Generator #

A Roll20 Custom Character Sheet templated using ReactJS. Uses React Static Site Generation with Webpack.


## Folder Structure ##

- The main entry file is `index.js`. We import our character sheet and all other things here. 
- React Components are located in `src/components`. The entry to the sheet is in `src/sheet.js`.
- Styles are handled through [Styled-Components](https://styled-components.com/) and are built into an external stylesheet using [Linaria](https://github.com/callstack/linaria). 
- In order to re-use field names throughout the HTML and our API Scripts/Workers, we define all attributes and stats in `/src/data`. Our components and scripts just import these data files to make use of them.
- API Scripts are located in `/src/scripts`, entered from `src/scripts.js` and are bundled together into a single scripts.out.js file with Rollup.
- Workers are located in `/src/workers/`, entered from `src/workers.js` and are injected after our Sheet HTML files gets built out.
- Why not use Github Pages to host your Player's Guide? `docs` contains the static site for the [player's guide](https://tojikan.github.io/znz-roll20/).
- This one was a little extra, but we use [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to encapsulate interactions for the Roll20 API. Basically, let's us call Roll20 API functions just by modifying an object. Located in `/src/actors`. 

## Build Results ##

- `/dist/sheet.html` built from `src/sheet.js`. HTML for our character sheets.
- `/dist/styles.css` built from Styled Components in our React Components.
- `/dist/scripts.out.js` built from `src/scripts.js`. All of our custom API scripts bundled together.

## Dependencies ##

- Node / NPM
- Webpack
- Gulp


## Commands ##

`npm run dev` - Run a local development server for previewing your character sheet in live mode. Most Roll20 built-in styles are copied over to attempt to imitate the Roll20 environment, but may need periodic updating. Currently does not have support for repeater fields.

`npm run build` - Actually builds out all of your files into a single bundle in `/dist/` for deployment. See following section on build files.  

Install with `npm install`.


## Build Process ##

The build process consists of Webpack to build the HTML and Gulp to finish off the rest. In Webpack, we use the [Static Site Generator Plugin](https://github.com/markdalgleish/static-site-generator-webpack-plugin) to build out our HTML and CSS files. In Gulp, we inject our Sheet Workers into the HTML and then run a separate bundler for our script filesto bundle them all into a single scripts.out.js file.


The following files gets built out into Dist.

- **sheet.html**: HTML for your character sheet, built with Webpack Static Site generation. Sheet workers are injected via Gulp at the bottom.

- **styles.css**: Styles made from Styled Components, built using [Linaria](https://github.com/callstack/linaria) into a single stylesheet. 

- **scripts.out.js**: All of your API scripts bundled together. You can just quickly copy+paste into the API terminal on Roll20.

For deployment, you would simply need to copy these files onto the Roll20 platform in the appropriate locations.



## Local Development Environment ##

A local development server can be spun up with `npm run dev`. This builds and serves up files in `public/`.

This creates a hot-reloaded environment where you can edit and view your Character Sheet in real time. It makes it easier to preview styling, layouts, etc.

Some styles are copied over from Roll20 so it can imitate the Roll20 environment as best as possible. This may need updating from time to time.

However, you do not have access to Sheet Workers or Repeater elements.





## Docs ##

We leverage Github Pages to build a Game Guide and System documentation. [Link.](https://tojikan.github.io/znz-roll20/)

See the `/docs` folder for more info. 

This is built out using [Jekyll on Github pages](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll) and is hosted directly on Github. 

We can even use it to host some assets like images or icons or fonts for our Character sheet.

The `docs.js` file is run on build. This copies over some specified files to the `docs/_data` folder so that we can use it in Jekyll.

Or, simply run `npm run docs` to copy over files.

Due to some unfortunate setup, we're using esm to be able to run this script as a module, for now.


## Lootprint ##

One of the API scripts is a deck drawing system for drawing loot. 

You can interact with it directly on the Roll20 API terminal and use that to set loot, etc.

Since it has to be formatted into JSON, we can use the Lootprint script to print out loot sets so we can copy paste into Roll20.

Check `lootprint.js` for more info.

Run `npm run loot` to run the script.


## Tests ##

This is not a fully unit-tested application as it was a learn-as-you-go sort of process. There are some unit tests for testing scripts and such. 

Tests are run with Mocha. Simply run `npm run test` to run unit tests.





