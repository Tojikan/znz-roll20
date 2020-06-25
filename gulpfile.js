
const gulp = require('gulp');
const sass = require('gulp-sass');
const fileinclude = require('gulp-file-include');
const replace = require('gulp-replace');

//compile scss into css
gulp.task('style', function() {
    return gulp.src('src/scss/main.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest('dist'));
});

//sheets
gulp.task('html', function(){
    gulp.src('src/html/preview.html')
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest('./dist'));
    
    return gulp.src('src/html/character-sheet.html')
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(replace('text/javascript', 'text/worker'))
    .pipe(gulp.dest('./dist'));
    
});

//watch sheets and styles
gulp.task('watch', function(){
    gulp.watch('./src/scss/*.scss', gulp.series(['style']));
    gulp.watch('./src/js/sheet/*.js' , gulp.series(['html']));
    gulp.watch('./src/html/*.html' , gulp.series(['html']));
});

//build sheets and styles
gulp.task('build', function(){
    gulp.series(['styles', 'html'])
});

