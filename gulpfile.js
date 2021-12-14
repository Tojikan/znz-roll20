const gulp = require('gulp'),
    {rollup} = require('gulp-rollup-2'),
    inject = require('gulp-inject'),
    commonjs = require('@rollup/plugin-commonjs'),
    json = require('@rollup/plugin-json'),
    babel = require('@rollup/plugin-babel'),
    htmlbeautify = require('gulp-html-beautify');


/** Append workers to sheet */
function sheet(){
    return gulp.src('./dist/sheet.html')
        .pipe(htmlbeautify())
        .pipe(inject( (()=>{
            return gulp.src('src/workers.js')
                .pipe(rollup({
                    input: './src/workers.js',
                    plugins:[babel.babel({ babelHelpers: 'bundled' }), commonjs(), json()],
                    output: {
                        file:'workers.out',
                        format: 'iife'
                    }
                }))
            })()
        ,{
            //Inject workers between script tag. This means you shouldn't put extra script tags in your sheet
            starttag: '<script type="text/worker">',
            endtag: '</script>',
            transform: function(filePath, file){
                return file.contents.toString('utf-8')
            }
        }))
        .pipe(gulp.dest('./dist'))
    ;
}

function scripts(){
    return gulp.src('src/scripts.js')
        .pipe(rollup({
            input:'src/scripts.js',
            plugins:[babel.babel({ babelHelpers: 'bundled' }), commonjs(), json()],
            output: {
                file: 'scripts.out.js',
                format: 'iife'
            }
        }))
        .pipe(gulp.dest('./dist'))
    ;
}

exports.default = gulp.series(sheet, scripts);
