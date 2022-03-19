# Roll20 Static Sheet Generator #

This is my build process for making Roll20 Custom Character Sheets. This is what does currently does.

- Build a static sheet html file from dumb React Components.
- Use styled components that extract out to a separate CSS file.
- Bundle and Inject Sheet Workers automatically.
- Bundle API Scripts into a single JS file.
- Abstract out character sheets into a JSON file.
- Abstract out some Roll20 API interactions.
- Build a GitHub page to make a game rules page.



## Quick Build Commands #


`npm run dev` - Run a local development server where you can modify your code real time. Good for markup and styling and copies over some of the styles from Roll20. But you don't have features for repeating fields and API interactions.

`npm run build` - Actually builds out all of your files into a single bundle in dist. The following get bundled into files:   Sheet Workers and Sheet HTML; Your styled component styles; API scripts. Meant for easier deployment to Roll20 (which is still manually done).


## What This Does ##

The current way is to try and separate a character sheet between its fields and its markup.


### Character Sheet ###

**Fields**
We define character sheets through a JSON data. This file contains all we want to know about the literal input field that will show up in the character sheet.

**Markup**
Using our fields data, we use React to generate the HTML for a field. This lets us build a sheet consisting of React Components, making it easier to work with our HTML and display logic.
As another benefit, our markup is now independent of the "fields" in the character sheet. 


### API and Workers ###

Because characters are now defined in this build system as a bunch of json fields, we can bundle it together with our Sheet Workers and APIs. Our Sheet Worker can just reference the fields.

**API Actors**

You'll notice an actors folder. Basically I got fancy and tried to define an object that we can use in the Roll20 Script API. We can try to abstract out a few things, including the code to try and get/set data through the Roll20API.





