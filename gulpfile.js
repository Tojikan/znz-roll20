
const gulp = require('gulp');
const sass = require('gulp-sass');
const fileInclude = require('gulp-file-include');
const replace = require('gulp-replace');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const fs = require('fs');
const path = require('path');
const tap = require('gulp-tap');
const inject = require('gulp-inject');
const removeEmptyLines = require('gulp-remove-empty-lines');
const log = require('fancy-log'); //for testing

const dataFolder = './data/';
const queryFolder = './data-query/';

//compile scss into css
gulp.task('style', function() {
    return gulp.src('src/scss/main.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('sheet'));
});

//build character sheet and workers.
gulp.task('sheet', function(){
    return gulp.src('src/templates/*.njk')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(data(getAllJsonData)) //pass all json data into Templates
        .pipe(data(getAllDataQuery)) //pass all data queries into templates
        .pipe(nunjucksRender({
            path:['src/templates']
        }))
        .pipe(inject(findDataQuery('src/workers/*.js'), { //process data queries in sheet workers and them into template
            //Inject Options
                starttag: '/** inject:workers **/',
                endtag: '/** endinject **/',
                transform: function(filePath, file){
                    return file.contents.toString('utf-8')
                }
            }))
        .pipe(removeEmptyLines())
        .pipe(replace('text/javascript', 'text/worker')) //roll20 doesn't like text/javascript
        .pipe(gulp.dest('./sheet'));
});




//watch sheets and styles
gulp.task('watch', function(){
    gulp.watch('./src/scss/*.scss', gulp.series(['style']));
    gulp.watch('./src/workers/*.js' , gulp.series(['sheet']));
    gulp.watch('./src/templates/**/*.njk' , gulp.series(['sheet']));
    gulp.watch('./data/*.json' , gulp.series(['sheet']));
    gulp.watch('./data-query/*.js' , gulp.series(['sheet']));
});

//build sheets and styles
gulp.task('build', gulp.series(['style', 'sheet']));


//Read all json files in data folder and save it in a data object with filename as key. Then passed in via gulp-data
function getAllJsonData(){
    let jsonData = {};
    let files = fs.readdirSync(dataFolder);

    files.forEach(file => {
        if (path.extname(file) === '.json'){
            let filename = path.basename(file, '.json');
            jsonData[filename] = JSON.parse(fs.readFileSync(dataFolder + file));
        }
    });

    return { jsonData };
}

//Run any JS files in data-query folder and save any exports into a data object with filename as key. Then passed in via gulp-data
//Any data query file should export a simple JS object for easy use in nunjucks
function getAllDataQuery(){
    let queryData = {};
    let files = fs.readdirSync(queryFolder);

    files.forEach(file => {
        if (path.extname(file) === '.js'){
            let filename = path.basename(file, '.js');

            queryData[filename] = require(queryFolder + file);
            delete require.cache[require.resolve(queryFolder + file)]; //clear cache
        }
    });

    return { queryData };
}


//Processes any data queries inside a specific file
function findDataQuery(src){
    return gulp.src([src])
        .pipe(replace(/\[\[{dataquery:\s*['"](.*)['"]}\]\]/, function(match, capture){ 
            //regex searches for all cases of [[[data-query='{text}']]],
            //param match - the whole instance found
            //param capture - the text captured between single quotes
            //We use the capture to try and find an appropriate data-query file and then replace contents.
            let importPath = queryFolder + '/' + capture + ".js";

            if (fs.existsSync(importPath)) {
                //if file exists, we can just require and then return it, so long as the data query exports valid JSON.
                let importData = require(importPath);
                delete require.cache[require.resolve(importPath)]; //clear cache
                return JSON.stringify(importData);
            } else {
                log("Located a data-query but did not find the specified data-query file!");
                return "\'\'";
            }}
        ));
}