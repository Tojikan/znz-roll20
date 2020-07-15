
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

    htmlProcess('src/html/htmlpreview.html');
    return htmlProcess('src/html/znz-character-sheet.html');
    
    gulp.src('src/html/htmlpreview.html')
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest('./dist'));

    gulp.src('src/html/znz-character-sheet.html')
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
    gulp.watch('./src/html/components/*.html' , gulp.series(['html']));
});

//build sheets and styles
gulp.task('build', function(){
    gulp.series(['styles', 'html'])
});

//function for handling html gulp
function htmlProcess(file){
    return gulp.src(file)
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(replace(/<!---@(.*?)-->/g, ''))
    .pipe(gulp.dest('./dist'));
}