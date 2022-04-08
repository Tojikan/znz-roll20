# Static Sheet Generator #

A Roll20 Sheet built with React and Static Site Generation.

- Sheet built with React Components in `components`. Uses Styled-Components for styling
- Character Data for fields, attributes, stats, etc and such are in `/data`
- Actors contains ways to modify a character in Roll20 API. Mostly done with a Proxy. In `/actors`
- API Scripts are bundled together in `/scripts`




## Build ##

`npm run dev` - Run a local development server where you can see your React Components in a live view mode. Good for dev'ing your front end. I tried to copy over as much of the built-in styling in Roll20 so it looks similar to live. Don't have working repeating elements though.

`npm run build` - Actually builds out all of your files into a single bundle in `/dist/` for deployment. The following gets built:   

- **sheet.html**: HTML for your character sheet.  Your Sheet workers are automatically copied in.

- **styles.css**: Styles built using [Linaria](https://github.com/callstack/linaria) into a single stylesheet. 

- **scripts.out.js**: All of your API scripts bundled together so its a quicker copy+paste on Roll20.


Build process does something ugly where we use webpack for the SSG and Linaria. But Gulp for injecting sheet workers.

TODO: Figure out how to fold Webpack into Gulp or move injectiong to Webpack.


## Dependencies ##

- Node / NPM
- Webpack
- Gulp


## Commands #


`npm run dev` - Run a local development server where you can modify your code real time. Good for markup and styling and copies over some of the styles from Roll20. But you don't have features for repeating fields and API interactions.

`npm run build` - Actually builds out all of your files into a single bundle in `/dist/`. The following gets built:   

- **sheet.html**: HTML for your character sheet and your Sheet Workers bundled and added in.

- **styles.css**: Using [Linaria](https://github.com/callstack/linaria),
Sheet Workers and Sheet HTML; Your styled component styles; API scripts. Meant for easier deployment to Roll20 (which is still manually done).







