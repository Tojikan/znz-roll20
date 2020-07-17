
const gulp = require('gulp');
const sass = require('gulp-sass');
const fileInclude = require('gulp-file-include');
const replace = require('gulp-replace');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const fs = require('fs');

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
            return {
                data: {
                    weaponTypes: JSON.parse(fs.readFileSync('./data/weaponTypes.json')),
                    equipmentTypes: JSON.parse(fs.readFileSync('./data/equipmentTypes.json')),
                    attributes: JSON.parse(fs.readFileSync('./data/attributes.json')).attributes,
                    proficiencies: JSON.parse(fs.readFileSync('./data/attributes.json')).proficiencies,
                }
            };
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
});

//build sheets and styles
gulp.task('build', gulp.series(['style', 'sheet']));