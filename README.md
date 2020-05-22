## Build Process ##

Uses browersync for active reloading. Use `gulp watch` to sync.

The preview html page is a wrapper around character-sheet that includes the html and styles since roll20 doesn't allow you to include this when uploading. This lets you 
preview the sheet.

`gulp styles` - build styles
`gulp include` - build the preview file
`gulp build` - build styles and move character-sheet to dist. 