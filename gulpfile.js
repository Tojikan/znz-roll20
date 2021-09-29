
const gulp = require('gulp');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const inject = require('gulp-inject');
const removeEmptyLines = require('gulp-remove-empty-lines');
const del = require('del');
const cleancss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');


const funkContext = require('./default_funkContext').defaultContext;

const allData = funkContext.getData();

/**
 * This task will build your character sheet's final HTML file from your Nunjucks templates and data functions.
 */
gulp.task('sheet', function(){
    return gulp.src('src/templates/*.njk')
        .pipe(replace(/\(\(\[\[(.*?)\]\]\)\)/gs, funkContext.doFunk))      // Run all data functions inside the template file.
        .pipe(data(allData))     // Passes all JSON data into the njk templates.
        .pipe(nunjucksRender({      // Render our Nunjucks into HTML!
            path:'src/templates',
            manageEnv: function(env){
                env.addGlobal('globalData', allData);    // This adds all of our data into a convenient global variables so it's easier to reference throughout the templates
            }
        }))
        .pipe(inject((() => {      // Now we take our sheet worker for injecting into our templates
            return gulp.src(['src/workers/*.js'])
            .pipe(replace(/\(\(\[\[(.*?)\]\]\)\)/gs, funkContext.doFunk))      // Now look for anything between (([[ ]])) with regex and pass it into our DoFunks!    
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
        .pipe(replace(/\(\(\[\[(.*?)\]\]\)\)/gs, funkContext.doFunk))
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
