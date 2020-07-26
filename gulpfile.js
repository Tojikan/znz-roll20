
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
const log = require('fancy-log');

const dataFolder = './data/';
const queryFolder = './data-query/';

gulp.task('test', function() {

    return gulp.src('src/html/character-sheet.html')
    .pipe(inject(//We start with running inject into the stream with all worker.js files
                /** First param of Inject - a stream*/
                gulp.src(['src/sheet-workers/*/worker.js']) 
                        .pipe(tap(function (file, t){ // In this stream, we tap into it to get the file path.
                    
                        let importPath = path.dirname(file.path) + '/import.js'; //then we can find an import.js which exports the data we need into a nicely packaged JSON array
                    
                        // if import exists, then we can just require it in.
                        if (fs.existsSync(importPath)) {
                            let importData = require(importPath);
                            return t.through(replace, ['[[\'data\']]', JSON.stringify(importData)]); //Tap returns a stream. We use t.through to run replace and replace all instances of [['data]] with a stringified version of our json array
                        }
                    })
                ),{ /** Second param of Inject - Options **/ //Back in Inject, we then inject the stream's contents from the first param into a specific location in the sheet file.
                starttag: '/** inject:workers **/',
                endtag: '/** endinject **/',
                transform: function(filePath, file){
                    return file.contents.toString('utf-8')
                }
            }
    ))
    .pipe(gulp.dest('sheet/'));
});

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
        .pipe(data(getAllJsonData)) //pass all json data into Nunjucks Templates
        .pipe(data(queryJson))
        .pipe(nunjucksRender({
            path:['src/templates']
        }))
        .pipe(replace('text/javascript', 'text/worker'))
        .pipe(removeEmptyLines())
        .pipe(gulp.dest('./sheet'));
});




//watch sheets and styles
gulp.task('watch', function(){
    gulp.watch('./src/scss/*.scss', gulp.series(['style']));
    gulp.watch('./src/js/sheet-workers/*.js' , gulp.series(['sheet']));
    gulp.watch('./src/templates/**/*.njk' , gulp.series(['sheet']));
    gulp.watch('./data/*.json' , gulp.series(['sheet']));
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
function queryJson(){
    let queryData = {};
    let files = fs.readdirSync(queryFolder);

    files.forEach(file => {
        if (path.extname(file) === '.js'){
            let filename = path.basename(file, '.js');

            queryData[filename] = require(queryFolder + file);
        }
    });

    return { queryData };
}