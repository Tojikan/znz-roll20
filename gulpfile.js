
const gulp = require('gulp');
const sass = require('gulp-sass');
const fileInclude = require('gulp-file-include');
const replace = require('gulp-replace');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const fs = require('fs');
const path = require('path');

const dataFolder = './data/';

gulp.task('test', function() {

    var output = {};
            
    let files = fs.readdirSync(dataFolder);

    files.forEach(file => {
        if (path.extname(file) === '.json'){
            let filename = path.basename(file, '.json');
            output[filename] = JSON.parse(fs.readFileSync(dataFolder + file));
        }
    })

    console.log(output)

});

//compile scss into css
gulp.task('style', function() {
    return gulp.src('src/scss/main.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('dist'));
});

//build character sheet and workers.
gulp.task('sheet', function(){
    return gulp.src('src/templates/*.njk')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(data(function(){
            //read all json files in data folder and pass it in a data object
            //each file will be read and stored in the data object with filename as a key
            let jsonData = {};
            let files = fs.readdirSync(dataFolder);

            files.forEach(file => {
                if (path.extname(file) === '.json'){
                    let filename = path.basename(file, '.json');
                    jsonData[filename] = JSON.parse(fs.readFileSync(dataFolder + file));
                }
            })

            return { jsonData };
        }))
        .pipe(nunjucksRender({
            path:['src/templates']
        }))
        .pipe(replace('text/javascript', 'text/worker'))
        .pipe(gulp.dest('./dist'));
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