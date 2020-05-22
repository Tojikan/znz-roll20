
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');

//compile scss into css
function style() {
    return gulp.src('src/scss/*.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}


function include(){
    return gulp.src('src/html/preview.html')
    .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
        }))
    .pipe(gulp.dest('./dist'));
}

function build(){
    style();
    return gulp.src('src/html/character-sheet.html')
    .pipe(gulp.dest('./dist'));

}


function watch() {
    browserSync.init({
        server: {
           baseDir: "./dist",
           index: "preview.html"
        }
    });
    gulp.watch('./src/scss/*.scss', style)
    gulp.watch('./src/html/*.html').on('change',include);
    gulp.watch('./src/html/*.html').on('change',browserSync.reload);
    gulp.watch('./src/js/*.js').on('change', browserSync.reload);
}

exports.style = style;
exports.watch = watch;
exports.build = build;
exports.include = include;