
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
const log = require('fancy-log');

const dataFolder = './data/';

gulp.task('test', function() {

    return gulp.src('src/html/character-sheet.html')
    .pipe(inject(gulp.src(['src/sheet-workers/*/worker.js'])
                .pipe(tap(function (file, t){ //1st param - stream of file
                    
                    let importPath = path.dirname(file.path) + '/import.js';
                    
                    if (fs.existsSync(importPath)) {
                        let importData = require(importPath);
                        return t.through(replace, ['[[\'data\']]', JSON.stringify(importData)]);
                    }
                })), { //2nd param - options for inject
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
        .pipe(nunjucksRender({
            path:['src/templates']
        }))
        .pipe(replace('text/javascript', 'text/worker'))
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


//Read all json files in data folder and save it in a data object with filename as key.
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
