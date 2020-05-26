
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const concat = require('gulp-concat');

//compile scss into css
function style() {
    return gulp.src('src/scss/*.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

function scripts(){
    return gulp.src('./src/js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./dist/'));
}


function include(){
    gulp.src('src/html/preview.html')
    .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
        }))
    .pipe(gulp.dest('./dist'));

    gulp.src('src/html/character-sheet.html')
    .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
        }))
    .pipe(gulp.dest('./dist'));
}

function build(){
    style();
    include();
}

function html(){
    include();
    browserSync.reload();
}


function watch() {
    browserSync.init({
        server: {
           baseDir: "./dist",
           index: "preview.html"
        }
    });
    gulp.watch('./src/scss/*.scss', style);
    gulp.watch('./src/js/*.js').on('change', scripts);
    gulp.watch('./src/html/*.html').on('change',html);
    gulp.watch('./src/js/*.js').on('change', browserSync.reload);
}

exports.style = style;
exports.watch = watch;
exports.build = build;
exports.html = html;
exports.scripts = scripts;
exports.include = include;