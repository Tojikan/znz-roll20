
# What is This #

A Roll20 Character sheet is just some HTML. React can be used as a static site generator to create some HTML. Hence, it's a Static Sheet Generator.

We also do other tedious stuff too like building styles, adding in sheet workers to your Sheet, etc. 




## Why should I use this? ##

- Fun project for learning React / Node / etc.
- Be able to make a sheet through reusable React Components.
- I hate working with HTML and Templaters.
- We can do some weird and fun abstractions in our code.


## How ##

We define a character in code through JSON. Then we define markup, styling, and layout through React Components. Our Components are self-contained React Components so it's easy to re-use. We use Linaria (styled components) so we can keep our styles together with our component. The HTML and styles then get generated through an automated build process.

Because our character is importable, we can use that to write our API scripts and Sheet Workers. The build process will bundle our sheet-workers directly into our HTML and our API Scripts get bundled so you only have to upload 1 script in Roll20.



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
