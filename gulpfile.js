
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
const cleancss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');

const dataFolder = './data/';


//build character sheet and workers.
gulp.task('sheet', function(){
    return gulp.src('src/templates/*.njk')
        .pipe(replace(/\(\(\[\[(.*?)\]\]\)\)/gs, queryData))
        .pipe(data(getAllData)) //pass all json data into Templates. should be done first since it also clears require() json cache
        .pipe(nunjucksRender({
            path:'src/templates',
            manageEnv: function(env){
                env.addGlobal('globalData', getAllData().sheetData);
            }
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
    gulp.watch('./data/*.js' , gulp.series(['sheet','scripts', 'data']));
    gulp.watch('./src/scripts/*.js' , gulp.series(['scripts']));
});


// Minify in place
gulp.task('minifyHtml', function(){
    return gulp.src('dist/character-sheet.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('minifyCss', function(){
    return gulp.src('dist/style.css')
    .pipe(cleancss({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist'));
});


gulp.task('data', function() {
    del(['docs/_data/**']);
    
    return gulp.src('data/*.json')
    .pipe(gulp.dest('docs/_data'));
});

//build sheets and styles
gulp.task('build', gulp.series(['data', 'style', 'sheet', 'scripts']));
//Minify in place
gulp.task('minify', gulp.series(['minifyHtml', 'minifyCss']));


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
function getAllData(){
    let sheetData = {};
    let files = fs.readdirSync(dataFolder);

    files.forEach(file => {
        //If JSON, simply parse it.
        if (path.extname(file) === '.json' && file.indexOf('schema') < 0){ //ignore schema
            let filename = path.basename(file, '.json');
            delete require.cache[require.resolve(dataFolder + file)]; //clear cache for json before it gets used by dataqueries
            sheetData[filename] = JSON.parse(fs.readFileSync(dataFolder + file));
        //If JS, save exports
        } else if (path.extname(file) === '.js'){
            
            let filename = path.basename(file, '.js');

            sheetData[filename] = require(dataFolder + file);
            delete require.cache[require.resolve(dataFolder + file)]; //clear cache
        }
    });

    return { sheetData };
}
