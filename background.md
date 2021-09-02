## Background ##

This project started as an effort to automate some of the tasks of building a custom character sheet for Roll20. To create a custom character sheet, Roll20 asks you to paste in HTML with some limitations, CSS, and optional JS to interact with the Roll20 API. A sheet is essentially static text added to Roll20 and rendered as a character sheet, so we can think of it like a static site AKA Static Sheet. We can make use of a templating engine to make writing HTML earlier and a CSS pre-processor to make writing CSS easier and use these to generate files that we add to Roll20. 


However, early on, I quickly discovered that maintaining a character sheet was madness. You have tons of fields that are basically just IDs on a form element. Luckily, we can use the templating engine to write logic on it so we can store our fields in JS objects

