
const gulp = require('gulp');
const sass = require('gulp-sass');
const fileInclude = require('gulp-file-include');
const replace = require('gulp-replace');
const nunjucksRender = require('gulp-nunjucks-render');

//compile scss into css
gulp.task('style', function() {
    return gulp.src('src/scss/main.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('dist'));
});

//build character sheet and workers.
gulp.task('sheet', function(){
    return gulp.src('src/templates/*.njk')
        .pipe(nunjucksRender({
            path:['src/templates']
        }))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
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