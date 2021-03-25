
const gulp = require('gulp');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const fs = require('fs');
const path = require('path');
const inject = require('gulp-inject');
const removeEmptyLines = require('gulp-remove-empty-lines');
const del = require('del');
const log = require('fancy-log'); //for testing

const dataFolder = './data/';
const queryFolder = './data-query/';
const prefixPath = './data/prefixes.json';


//build character sheet and workers.
gulp.task('sheet', function(){
    return gulp.src('src/templates/*.njk')
        .pipe(replace(/\(\(\[\[(.*?)\]\]\)\)/gs, queryData))
        .pipe(data(getAllJsonData)) //pass all json data into Templates. should be done first since it also clears require() json cache
        .pipe(nunjucksRender({
            path:['src/templates']
        }))
        //Inject workers into sheet.
        .pipe(inject((() => { 
            return gulp.src(['src/workers/*.js'])
            .pipe(replace(/\(\(\[\[(.*?)\]\]\)\)/gs, queryData))
        })(), { 
            //Inject Options
                starttag: '/** inject:workers **/',
                endtag: '/** endinject **/',
                transform: function(filePath, file){
                    return file.contents.toString('utf-8')
                }
            }))
        .pipe(removeEmptyLines())
        .pipe(replace('text/javascript', 'text/worker')) //roll20 doesn't like text/javascript
        .pipe(gulp.dest('./dist'));
});

//build API scripts
gulp.task('scripts', function(){
    return gulp.src('src/scripts/*.js')
        .pipe(replace(/\(\(\[\[(.*?)\]\]\)\)/gs, queryData))
        .pipe(gulp.dest('./dist'));
});


//compile scss into css
gulp.task('style', function() {
    return gulp.src('src/scss/style.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('dist'));
});


//watch sheets and styles
gulp.task('watch', function(){
    gulp.watch('./src/scss/*.scss', gulp.series(['style']));
    gulp.watch('./src/scss/*/*.scss', gulp.series(['style']));
    gulp.watch('./src/workers/*.js' , gulp.series(['sheet']));
    gulp.watch('./src/templates/**/*.njk' , gulp.series(['sheet']));
    gulp.watch('./data/*.json' , gulp.series(['sheet','scripts', 'data']));
    gulp.watch('./data-query/*.js' , gulp.series(['sheet','scripts']));
    gulp.watch('./src/scripts/*.js' , gulp.series(['scripts']));
});

//build sheets and styles
gulp.task('build', gulp.series(['style', 'sheet', 'scripts']));


gulp.task('data', function() {
    del(['docs/_data/**']);
    
    return gulp.src('data/*.json')
        .pipe(gulp.dest('docs/_data'));
});


/**
 * queryData
 * 
 * gulp-replace callback function that connects to functions in data-query.js
 * Takes what is captured and evals() it, returning the results back to gulp-replace
 * 
 * @param {string} match The whole regex match, passed by gulp-replace. Unused here, but placeholder as we need the second param. 
 * @param {*} capture Anything in the main capture group. This should be a function call to a function in data-query.js.
 */
function queryData(match, capture){
    //clear cache so file contents update
    clearDataFileCache();
    delete require.cache[require.resolve('./data-query')]; 

    const dataquery = require('./data-query');

    if (capture.length){
        try {
            const result = eval('dataquery.' + capture);
    
            if (typeof result == "string" || typeof result == "number" || typeof result == "boolean" ){
                return result;
            } else if (typeof result == 'object') {
                return JSON.stringify(result);
            } else {
                log(`queryData Warning! The data query '${capture}' did not return a valid value. Replaced capture with empty string instead.`)
            }
            
        } catch(e) {
            log(e);
        }
    }
    return '';
}

// Clear Cache
function clearDataFileCache(){
    let dataFiles = fs.readdirSync(dataFolder);

    dataFiles.forEach(file => {
        if (path.extname(file) === '.json' || path.extname(file) === '.js'){
            delete require.cache[require.resolve(dataFolder + file)];
        }
    });
}



//Read all files in data folder and save it in a data object with filename as key. Then passed in via gulp-data
function getAllJsonData(){
    let jsonData = {};
    let files = fs.readdirSync(dataFolder);

    files.forEach(file => {
        //If JSON, simply parse it.
        if (path.extname(file) === '.json' && file.indexOf('schema') < 0){ //ignore schema
            let filename = path.basename(file, '.json');
            delete require.cache[require.resolve(dataFolder + file)]; //clear cache for json before it gets used by dataqueries
            jsonData[filename] = JSON.parse(fs.readFileSync(dataFolder + file));
        //If JS, save exports
        } else if (path.extname(file) === '.js'){
            
            let filename = path.basename(file, '.js');

            queryData[filename] = require(queryFolder + file);
            delete require.cache[require.resolve(queryFolder + file)]; //clear cache
        }
    });

    return { jsonData };
}
