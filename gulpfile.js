
const gulp = require('gulp');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const fs = require('fs');
const path = require('path');
const tap = require('gulp-tap');
const inject = require('gulp-inject');
const removeEmptyLines = require('gulp-remove-empty-lines');
const del = require('del');
const log = require('fancy-log'); //for testing

const dataFolder = './data/';
const queryFolder = './data-query/';
const prefixPath = './data/prefixes.json';

//compile scss into css
gulp.task('style', function() {
    return gulp.src('src/scss/main.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('sheet'));
});


gulp.task('data', function() {
    del(['docs/_data/**']);
    
    return gulp.src('data/*.json')
        .pipe(gulp.dest('docs/_data'));
});



//build character sheet and workers.
gulp.task('sheet', function(){
    return gulp.src('src/templates/*.njk')
        .pipe(data(getAllJsonData)) //pass all json data into Templates. should be done first since it also clears require() json cache
        .pipe(data(getAllDataQuery)) //pass all data queries into templates
        .pipe(nunjucksRender({
            path:['src/templates']
        }))
        .pipe(inject((() => { //process data queries in sheet workers and them into template (first param is an iife)
            return gulp.src(['src/workers/*.js'])
            //regex searches for all cases of [[[dataquery:'{text}']]]. Any text between single quotes are captured.
            .pipe(replace(/\[\[{dataquery:\s*['"](.*?)['"]}\]\]/g, replaceWithFileContent))
            .pipe(replace(/\[\[{attrlookup:\s*['"](.*?)['"]}\]\]/g, replaceCanonicalWithAttrName))
            .pipe(replace(/\(\(\({runFunc:.*?{(.*?)}}\)\)\)/gs, runFunction))
            .pipe(replace(/\(\(\({datasrc:\s*['"](.*?)['"]}\)\)\)/g, getData))
            .pipe((replace(/\[\[{prefix:\s*['"](.*?)['"]}\]\]/g, replaceWithPrefix)));
        })(), { 
            //Inject Options
                starttag: '/** inject:workers **/',
                endtag: '/** endinject **/',
                transform: function(filePath, file){
                    return file.contents.toString('utf-8')
                }
            }))
        .pipe(removeEmptyLines())
        .pipe(replace('text/javascript', 'text/worker')) //roll20 doesn't like text/javascript
        .pipe(gulp.dest('./sheet'));
});

//build API scripts
gulp.task('scripts', function(){
    return gulp.src('src/scripts/*.js')
        .pipe((replace(/\[\[{dataquery:\s*['"](.*?)['"]}\]\]/g, replaceWithFileContent)))
        .pipe((replace(/\[\[{attrlookup:\s*['"](.*?)['"]}\]\]/g, replaceCanonicalWithAttrName)))
        .pipe(replace(/\(\(\({runFunc:.*?{(.*?)}}\)\)\)/gs, runFunction))
        .pipe(replace(/\(\(\({datasrc:\s*['"](.*?)['"]}\)\)\)/g, getData))
        .pipe((replace(/\[\[{prefix:\s*['"](.*?)['"]}\]\]/g, replaceWithPrefix)))
        .pipe(gulp.dest('./sheet'));
});


//watch sheets and styles
gulp.task('watch', function(){
    gulp.watch('./src/scss/*.scss', gulp.series(['style']));
    gulp.watch('./src/workers/*.js' , gulp.series(['sheet']));
    gulp.watch('./src/templates/**/*.njk' , gulp.series(['sheet']));
    gulp.watch('./data/*.json' , gulp.series(['sheet','scripts', 'data']));
    gulp.watch('./data-query/*.js' , gulp.series(['sheet','scripts']));
    gulp.watch('./src/scripts/*.js' , gulp.series(['scripts']));
});

//build sheets and styles
gulp.task('build', gulp.series(['style', 'sheet', 'scripts', 'data']));


//Read all json files in data folder and save it in a data object with filename as key. Then passed in via gulp-data
function getAllJsonData(){
    let jsonData = {};
    let files = fs.readdirSync(dataFolder);

    files.forEach(file => {
        if (path.extname(file) === '.json' && file.indexOf('schema') < 0){ //ignore schema
            let filename = path.basename(file, '.json');
            delete require.cache[require.resolve(dataFolder + file)]; //clear cache for json before it gets used by dataqueries
            jsonData[filename] = JSON.parse(fs.readFileSync(dataFolder + file));
        }
    });

    return { jsonData };
}

//Run any JS files in data-query folder and save any exports into a data object with filename as key. Then passed in via gulp-data
//Any data query file should export a simple JS object for easy use in nunjucks
function getAllDataQuery(){
    let queryData = {};
    let files = fs.readdirSync(queryFolder);

    files.forEach(file => {
        if (path.extname(file) === '.js'){
            let filename = path.basename(file, '.js');

            queryData[filename] = require(queryFolder + file);
            delete require.cache[require.resolve(queryFolder + file)]; //clear cache
        }
    });

    return { queryData };
}

/**
 * Looks at capture, converts to a function, and runs it.
 * 
 * @param {string} match 
 * @param {string} capture 
 */
function runFunction(match, capture){
    const req = require;

    let func = new Function('require',capture);
    let results = JSON.stringify(func(req)) || "\'\'";

    return results;
}

/**
 * Looks at capture, gets a data file, and returns it
 * 
 * @param {string} match 
 * @param {string} capture 
 */
function getData(match, capture){
    let importPath = dataFolder + '/' + capture + ".json";
    delete require.cache[require.resolve(importPath)]; //clear cache
    
    if (fs.existsSync(importPath)) {
        //if file exists, we can just require and then return it, so long as the data query exports valid JSON.
        let importData = require(importPath);
        delete require.cache[require.resolve(importPath)]; //clear cache
        delete importData['$schema'] //ignore schema

        return JSON.stringify(importData);
    } else {
        log("Located a data path but did not find the specified data file!");
        return "\'\'";
    }
}



/**
 * Looks at the capture, see if its a key in the prefixes object, and replaces it with the matching value
 * 
 * @param {string} match The full match of the regex. Unused but needed for gulp-replace
 * @param {string} capture Anything captured in the regex. In this case, it should be a property in the prefix file with a prefix.
 */
function replaceWithPrefix(match, capture){
    delete require.cache[require.resolve(prefixPath)]; //clear cache
    const prefixes = require(prefixPath);

    if (capture in prefixes){
        return prefixes[capture];
    } else {
        return '\'\'';
    }

}


/**
 * Looks at the capture and then tries to locate the file in the dataquery folder. If it finds one, it'll return its file contents.
 * This is used in the gulp-replace callback to replace a match with a specified file's contents.
 * 
 * @param {string} match The full match of the regex. Unused but needed for gulp-replace
 * @param {string} capture Anything captured in the regex. In this case, it should be a filename to a query file in data-query.
 */
function replaceWithFileContent(match, capture){
    //We use the capture to try and find an appropriate data-query file and then replace contents.
    let importPath = queryFolder + '/' + capture + ".js";

    if (fs.existsSync(importPath)) {
        //if file exists, we can just require and then return it, so long as the data query exports valid JSON.
        let importData = require(importPath);
        delete require.cache[require.resolve(importPath)]; //clear cache
        return JSON.stringify(importData);
    } else {
        log("Located a data-query but did not find the specified data-query file!");
        return "\'\'";
    }
}

/**
 * Looks at the capture and tries to locate any object in the JSON folder with a matching canonical property that has an attr_name property.
 * 
 * @param {string} match Full match of the regex. Unused but needed for gulp-replace
 * @param {string} capture Anything captured in the regex. In this case, it should be the text value of a canonical property. 
 */
function replaceCanonicalWithAttrName(match, capture){
    let files = fs.readdirSync(dataFolder);
    var result = null;

    files.forEach(file => {
        if (path.extname(file) === '.json' && file.indexOf('schema') < 0){ //ignore schema
            let filename = path.basename(file, '.json');
            delete require.cache[require.resolve(dataFolder + file)]; //clear cache to get most recent.

            let data = JSON.parse(fs.readFileSync(dataFolder + file)),
                found = getAttrOfCanonical(capture, data);

            if (found != null){
                result = getAttrOfCanonical(capture, data)
            }
        }
    });

    if (result){
        return result;
    } else {
        return '\'\'';
    }

}

/**
 * This is a recursive function that recurses through a JSON object. It'll look through all other objects and arrays
 * in the object to search for a "canonical" property that matches a string. If it finds it, it will return a "attr_name" in the same property.
 * 
 * @param {string} canon canonical string to search for in object
 * @param {object} object the data object
 * @returns string value of "attr_name" if the appropriate canonical has been located, or null if nothing has been found.
 */
function getAttrOfCanonical(canon, object){
    // Fail case - nothing has been found
    if (object == null){
        return null; 
    }

    //Success case - found canonical
    if (typeof object === "object" && "canonical" in object && "attr_name" in object && object.canonical == canon) {
        return object['attr_name'];
    } 
    
    //Array - search search array
    else if (typeof object == "array"){
        for (let arrItem of array){
             let val = getAttrOfCanonical(canon, arrItem);

             if (val != null){
                 return val;
             }
        }
        return null;
    } 

    //Object - search all properties in object
    else if (typeof object == "object"){
        for (let key of Object.keys(object)){
            let val = getAttrOfCanonical(canon, object[key]);

            if (val != null){
                return val;
            }
        }
        return null;
    }

    //End case - not an object or array
    else {
        return null;
    }
}

