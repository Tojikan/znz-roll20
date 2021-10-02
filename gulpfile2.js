import { FieldsExporter } from './fieldExporter';


const   gulp = require('gulp'),
        sass = require('gulp-sass'),
        replace = require('gulp-replace'),
        nunjucksRender = require('gulp-nunjucks-render'),
        data = require('gulp-data'),
        inject = require('gulp-inject'),
        removeEmptyLines = require('gulp-remove-empty-lines'),
        del = require('del'),
        cleancss = require('gulp-clean-css'),
        htmlmin = require('gulp-htmlmin'),
        rollup = require('rollup-stream');


const fieldsPath = './src/fields.js';

function sheet(){
    return gulp.src('src/templates/*.njk')
        .pipe(nunjucksRender({      // Render our Nunjucks into HTML!
            path:'src/templates',
            manageEnv: function(env){
                exporter = new FieldsExporter('./src/data');

                // Fields gets all JSON or JS Exports with fields key in a specified data path and returns them as a single object where the key is the filename and value is the contents of the JSON/exports.fields
                // Add this into global variable data.
                env.addGlobal('data', exporter.getFields());
                
                //Gets Label Key if an object
                env.addFilter('getLabel', functions.getLabel);
                env.addFilter('getAttr', functions.getId);
            }
        }))
}


exports.sheet = sheet