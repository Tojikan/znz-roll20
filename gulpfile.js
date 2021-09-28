
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


/**
 * This task will build your character sheet's final HTML file from your Nunjucks templates and data functions.
 */
gulp.task('sheet', function(){
    return gulp.src('src/templates/*.njk')
        .pipe(replace(/\(\(\[\[(.*?)\]\]\)\)/gs, DoFunks))      // Run all data functions inside the template file.
        .pipe(data(getAllData))     // Passes all JSON data into the njk templates.
        .pipe(nunjucksRender({      // Render our Nunjucks into HTML!
            path:'src/templates',
            manageEnv: function(env){
                env.addGlobal('globalData', getAllData().sheetData);    // This adds all of our data into a convenient global variables so it's easier to reference throughout the templates
            }
        }))
        .pipe(inject((() => {      // Now we take our sheet worker for injecting into our templates
            return gulp.src(['src/workers/*.js'])
            .pipe(replace(/\(\(\[\[(.*?)\]\]\)\)/gs, DoFunks))      // Now look for anything between (([[ ]])) with regex and pass it into our DoFunks!    
        })(), { 
                starttag: '/** inject:workers **/',     // Inject your workers as a pure string between the appropriate tag pattern!
                endtag: '/** endinject **/',
                transform: function(filePath, file){
                    return file.contents.toString('utf-8')
                }
            }))
        .pipe(removeEmptyLines())                                               // Some clean up
        .pipe(replace('text/javascript', 'text/worker'))                        // Roll20 doesn't like text/javascript
        .pipe(gulp.dest('./dist'));                                             // To Dist!
});

/**
 * This task will take your API Scripts, process any Data Function, and then copy it to dist.
 */
gulp.task('scripts', function(){
    return gulp.src('src/scripts/*.js')
        .pipe(replace(/\(\(\[\[(.*?)\]\]\)\)/gs, DoFunks))
        .pipe(gulp.dest('./dist'));
});


/**
 * This tasks takes your SCSS and compiles it for you to CSS!
 */
gulp.task('style', function() {
    return gulp.src('src/scss/style.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('dist'));
});


/**
 * This task watches all files and calles the appropriate task!
 */
gulp.task('watch', function(){
    gulp.watch('./src/scss/*.scss', gulp.series(['style']));
    gulp.watch('./src/scss/*/*.scss', gulp.series(['style']));
    gulp.watch('./src/workers/*.js' , gulp.series(['sheet']));
    gulp.watch('./src/templates/**/*.njk' , gulp.series(['sheet']));
    gulp.watch('./data/*.json' , gulp.series(['sheet','scripts', 'data']));
    gulp.watch('./data/*.js' , gulp.series(['sheet','scripts', 'data']));
    gulp.watch('./src/scripts/*.js' , gulp.series(['scripts']));
});


/**
 * Minifies your HTML for smaller filesizes but harder to read files. Use it for Prod
 */
gulp.task('minifyHtml', function(){
    return gulp.src('dist/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

/**
 * Minifies your CSS for smaller filesizes but harder to read files. Use it for Prod
 */
gulp.task('minifyCss', function(){
    return gulp.src('dist/style.css')
    .pipe(cleancss({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist'));
});


/**
 * Takes your JSON data and copies it over to the docs folder so we can use it in our system documentation site!
 */
gulp.task('docs', function() {
    del(['docs/_data/**']); 
    return gulp.src('data/*.json')
    .pipe(gulp.dest('docs/_data'));
});

/**
 * Builds all of your files and minifies it
 */
gulp.task('build', gulp.series(['data', 'style', 'sheet', 'scripts', 'minifyHtml', 'minifyCss']));


/**
 * Build your files without minification.
 */
gulp.task('develop', gulp.series(['data', 'style', 'sheet', 'scripts']));


/**
 * RunFunks
 * 
 * This is the main connection point to functions in funcs.js, called as a callback by gulp-replace
 * 
 * Basically we capture something between a pattern (via regex) and feed it to this function. The capture gets fed to here which gets eval()'ed to any function within
 * the _funcs file. Basically letting us run any predefined JS functions on our source html and js files!
 * 
 * Whatever is returned by the data functions is then fed as a pure string into the gulp stream and will be injected into the code.
 * 
 * @param {string} match The whole regex match, passed into here by gulp-replace. Unused here, but a placeholder parameter as gulp-replace always passes it. 
 * @param {*} capture Anything in the main capture group. This should be a function call to a function in data-query.js.
 */
function DoFunks(match, capture){
    //clear cache so we get the most latest file contents prior to importing them.
    clearDataFileCache();

    const importedFuncs = require('./_funks'); //Import our funcs from our funcs file! Don't worry if you get a 'declared but never read warning'.

    if (capture.length){
        try {
            const result = eval('importedFuncs.' + capture); //Scope our eval to the importedFuncs, thus limiting our eval to only using our predetermined functions.
    
            if (typeof result == "string" || typeof result == "number" || typeof result == "boolean" ){
                return result;
            } else if (typeof result == 'object') {
                return JSON.stringify(result);
            } else {
                log(`DoFunks Warning! The data query '${capture}' did not return a valid value. Replaced capture with empty string instead.`)
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
