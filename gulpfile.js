require("@babel/register");


const   gulp = require('gulp'),
        sass = require('gulp-sass'),
        replace = require('gulp-replace'),
        nunjucksRender = require('gulp-nunjucks-render'),
        header = require('gulp-header');
        inject = require('gulp-inject'),
        removeEmptyLines = require('gulp-remove-empty-lines'),
        del = require('del'),
        cleancss = require('gulp-clean-css'),
        htmlmin = require('gulp-htmlmin'),
        {rollup} = require('gulp-rollup-2'),
        commonjs = require('@rollup/plugin-commonjs'),
        json = require('@rollup/plugin-json'),
        babel = require('gulp-babel'),
        {BuildContext} = require('./BuildContext');




const buildContext = new BuildContext('./src/model')

/** Build HTML Templates from NJKS **/
function sheet(){
    return gulp.src('src/templates/*.njk')
        .pipe(replace(/\(\(\[\[(.*?)\]\]\)\)/gs, evalReplace))
        // Render our HTML from NJKS
        .pipe(nunjucksRender({     
            path:'src/templates',
            manageEnv: function(env){
                //Adds our data to global variable so we can reference anywhere in njk templates
                env.addGlobal('fields', buildContext.getFields().fields);
                env.addGlobal('options', buildContext.getFields().options);
        
                //Takes all functions in exported filters and adds them as filters to NJKS
                const filters = require('./BuildContext').filters; //use require so we can dynamically include new filters as they are added
                for (let func in filters){
                    if (typeof filters[func] == 'function'){
                        env.addFilter(func, filters[func]);
                    }
                }
            }
        }))
        //  Inject sheet workers into the script
        .pipe(inject((() => {      
                // Use Rollup to bundle up our workers
                return gulp.src('src/workers/workers.js')
                    .pipe(rollup({
                        input: './src/workers/workers.js',
                        plugins:[commonjs(), json()],
                        output: {
                            file:'workers.out',
                            format: 'iife'
                        }
                    }))
                    .pipe(replace(/\(\(\[\[(.*?)\]\]\)\)/gs, evalReplace))
                })()
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
        //roll20 and nunjucks conflicts on use of {{ - convert <% %> into {{ }} when publishing the html to roll20
        .pipe(replace('<%', '{{')) 
        .pipe(replace('%>', '}}'))
        .pipe(gulp.dest('./dist'));
}

/** Compile Scripts with Rollup **/
function scripts(){
    return gulp.src('src/scripts/scripts.js')
        .pipe(rollup({
            input:'src/scripts/scripts.js',
            plugins:[commonjs(), json()],
            output: {
                file: 'scripts.out.js',
                format: 'iife'
            }
        }))
        .pipe(replace(/\(\(\[\[(.*?)\]\]\)\)/gs, evalReplace))
        .pipe(gulp.dest('./dist'));
    }

/** Compile SASS into Styles **/
function styles(){
    return gulp.src('src/scss/style.scss')
    .pipe(header(require('./BuildContext').sassHeaders))//use require so we can dynamically include new headers as they are added
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
    gulp.watch('./src/model/*.js' , gulp.series(['sheet','scripts']));
    gulp.watch('./src/model/*.json' , gulp.series(['sheet','scripts']));
    gulp.watch('./src/scripts/*.js' , gulp.series(['scripts']));
    gulp.watch('./src/scripts/*/*.js' , gulp.series(['scripts']));
}

/**
 * Takes a capture, evals it within a given context, and then returns what to replace the capture with.
 * 
 * @param {*} match - Not used but needed since gulp replace passes us this
 * @param {*} capture - The capture
 * @returns text to replace the capture with.
 */
function evalReplace(match, capture){
    const context = buildContext.getContext();

    if (capture.length){
        try {
            const result = eval('context.' + capture);

            if (typeof result == 'object' || Array.isArray(result)){
                return JSON.stringify(result);
            } else if (typeof result == "string" || typeof result == "number" || typeof result == "boolean" ){
                return result;
            }

            console.error('evalReplace - Could not evaluate a valid value! Replaced capture with empty string instead ');
        } catch(e){
            console.error(e)
        }
    }

    return '';

}


exports.sheet = sheet;
exports.scripts = scripts;
exports.styles = styles;
exports.watch = watch;
exports.build = gulp.series(sheet, scripts, styles);