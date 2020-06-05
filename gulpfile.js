
const gulp = require('gulp');
const sass = require('gulp-sass');
const fileinclude = require('gulp-file-include');
const concat = require('gulp-concat');
const replace = require('gulp-replace');

//compile scss into css
function style() {
    return gulp.src('src/scss/main.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest('dist'));
}

function scripts(){
    return gulp.src('./src/js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./dist/'));
}

function build(){
    style();
    replaceWithWorker();
}

function html(){
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
    .pipe(replace('text/javascript', 'text/worker'))
    .pipe(gulp.dest('./dist'));
}


function watch() {
    gulp.watch('./src/scss/*.scss', style);
    gulp.watch('./src/js/*.js').on('change', scripts);
    gulp.watch('./src/js/sheet/*.js').on('change',html);
    gulp.watch('./src/html/*.html').on('change',html);
}

exports.style = style;
exports.watch = watch;
exports.build = build;
exports.html = html;
exports.scripts = scripts;
exports.replace = replace;