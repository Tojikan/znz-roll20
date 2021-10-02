
const   gulp = require('gulp'),
        sass = require('gulp-sass'),
        replace = require('gulp-replace'),
        nunjucksRender = require('gulp-nunjucks-render'),
        inject = require('gulp-inject'),
        removeEmptyLines = require('gulp-remove-empty-lines'),
        del = require('del'),
        cleancss = require('gulp-clean-css'),
        htmlmin = require('gulp-htmlmin'),
        rollup = require('rollup-stream'),
        source = require('vinyl-source-stream'),
        {commonjs} = require('@rollup/plugin-commonjs'),
        {BuildContext} = require('./BuildContext');




const context = new BuildContext('./src/data')

/** Build HTML Templates from NJKS **/
function sheet(){
    return gulp.src('src/templates/*.njk')
        // Render our HTML from NJKS
        .pipe(nunjucksRender({     
            path:'src/templates',
            manageEnv: function(env){
                //Adds our data to global variable so we can reference anywhere in njk templates
                env.addGlobal('data', context.getFields());    
        
                //Takes all functions in exported filters and adds them as filters to NJKS
                const filters = require('./BuildContext').filters; //use require so we can dynamically include new filters as they are added
                for (let func in filters){
                    if (typeof filters[func] == 'function'){
                        env.addFilter(func, filters[func]);
                    }
                }
            }
        }))
        //Inject sheet workers into the script
        .pipe(inject((() => {      
                // Use Rollup to bundle up our workers
                return rollup({
                    input: './src/workers/main.js',
                    format: 'iife',
                })})()
            ,{ 
                // Inject your workers as a pure string between the appropriate tag pattern
                starttag: '/** inject:workers **/',     
                endtag: '/** endinject **/',
                transform: function(filePath, file){
                    return file.contents.toString('utf-8')
                }
            }))                                   
        //Just in case you forget
        .pipe(replace('text/javascript', 'text/worker'))
        //Pump it to Dist
        .pipe(gulp.dest('./dist'));
}

/** Compile Scripts with Rollup **/
function scripts(){
    return rollup('rollup.config.js')
    .pipe(source('scripts.js'))
    .pipe(gulp.dest('./dist'));
}

/** Compile SASS into Styles **/
function styles(){
    return gulp.src('src/scss/style.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest('dist'));
}

/** Watch for File Changes and call appropriate gulp task */
function watch(){
    gulp.watch('./src/scss/*.scss', gulp.series(['styles']));
    gulp.watch('./src/scss/*/*.scss', gulp.series(['styles']));
    gulp.watch('./src/workers/*.js' , gulp.series(['sheet']));
    gulp.watch('./src/workers/*/*.js' , gulp.series(['sheet']));
    gulp.watch('./src/templates/*.njk' , gulp.series(['sheet']));
    gulp.watch('./src/templates/**/*.njk' , gulp.series(['sheet']));
    gulp.watch('./src/data/*.js' , gulp.series(['sheet','scripts']));
    gulp.watch('./src/data/*.json' , gulp.series(['sheet','scripts']));
    gulp.watch('./src/scripts/*.js' , gulp.series(['scripts']));
    gulp.watch('./src/scripts/*/*.js' , gulp.series(['scripts']));
}


exports.sheet = sheet;
exports.scripts = scripts;
exports.styles = styles;
exports.build = gulp.series(sheet, styles, scripts);
exports.watch = watch;