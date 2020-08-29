const fs = require('fs'),
    path = require('path'),
    DATA_FOLDER = './data/',
    PREFIX_PATH = './data/prefixes.json',
    VALID_EXTENSIONS = ['.json', '.js']; // It's important you don't have conflicting filenames regardless of extension (i.e. don't have example.js and example.json)


var queryFunctions = {
    /**
     * Performs a search in data files. If it finds an object property with a specified string value, it will return that object. Useful if you're looking for a specific piece of data.
     * @param value the value to search for. This should be the main parameter of the data query and should be a string. 
     * @param options Additional options for customizing the search. 
     */
    valueSearch: (value, options) => {
        var prop = options.prop || ''; // Option: Search for a specific property. Enter property name as string.
            src = options.src || ''; // Option: Search in a given file. Enter the file name with no extension. 
            retprop = options.retprop || '', // Option: Return a specific property from the found object.
            dataSource = src ? getSrc(src) : getAllData();
        
        if (!value){
            return '';
        }

        if (dataSource) {
            let result = searchForValue(value, dataSource, prop, retprop);

            if (result){ 
                return result;
            }
        }
            
        return '';
    },
    /**
     * Returns the value of a given property in data files. 
     * @param value the property to return the value of. To access nested propertys, use dot notation (i.e. grandparent.parent.prop). If access through an array, simple use a number (parent.0.prop)
     * @param options Additional options
     */
    propLookup: (value, options) => {
        var src = options.src || ''; // Option: Search in a given file. Enter the file name with no extension.
        
        if (!value){
            return '';
        }

        if (src){
            //https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arays-by-string-path
            return value.split('.').reduce( (p,c) => p && p[c] || '', getSrc(src));
        } else {
            let allSrc = getAllData();

            //Search through all files
            for (let key of Object.keys(allSrc)){

                let results = value.split('.').reduce( (p,c) => p && p[c] || '', allSrc[key]);

                if (results)
                    return results;
            }
        }
        return '';

    }
}


function handleDataQuery(obj) {
    for (let key of Object.keys(obj)) {
        if ( key in queryFunctions) {

            let mainParam = obj[key];
            delete obj[key]; //Everything else is passed into an options object

            return queryFunctions[key]( mainParam, obj);
        }
    }

    return '';
}
exports.handleDataQuery = handleDataQuery;


/************** Helpers ****************/

function getSrc(fileName){
    if (typeof fileName == 'undefined') {
        console.error('No filename passed in!');
        return null;
    }    


    for ( let ext of VALID_EXTENSIONS) {
        let filePath = DATA_FOLDER + fileName + ext;

        if (fs.existsSync(filePath)) {
            
            try {
                delete require.cache[require.resolve(filePath)]; //Clear cache
                let importData = require(filePath);
                return (importData);
            } catch (e) {
                console.error('Could not get stringify file - is the file valid JSON or returns valid JSON?. Continuing...');
            }
        }
    }
    console.error('File was not found!');
    return null;
}



function getAllData() {
    let jsonData = {};
    let files = fs.readdirSync(DATA_FOLDER);

    files.forEach(file => {
        if (path.extname(file) === '.json' && file.indexOf('schema') < 0){ // ignore files with schema in it.
            let filename = path.basename(file); //Avoid same name file
            delete require.cache[require.resolve(DATA_FOLDER + file)]; //clear cache for json before it gets used by dataqueries

            try {
                jsonData[filename] = JSON.parse(fs.readFileSync(DATA_FOLDER + file));
            } catch(e) {
                console.error('File: ' + filename + ' was not valid JSON!');
            }
        }
    });

    return jsonData;
}



/**
 * This is a recursive function that recurses through a JSON object and searches for a given value. The function will go through any
 * arrays or objects inside the JSON object and search for any property that has the value. If it finds it, it will return the direct parent of the property.
 * 
 * @param {object} value Property value that the function will look for.
 * @param {object} obj the Object the function is looking through. If it is an array or object type, the algorithm will recurse and dig deeper.
 * @param {string} prop A specific prop to search for. The algorithm will only find matching a matching property with the value
 * @param {string} retprop If you do not want to return the full object, you can specify a specific property of the object to return instead.
 * @returns The full object containing the value or a specific property in the object if you specify 'retprop' or null if nothing is found.
 */
function searchForValue(value, obj, prop = '', retprop = ''){
    // Fail case - nothing has been found
    if (obj == null){
        return null; 
    }

    //Success case - Searching for specific key in an object
    if (prop && typeof obj === "object" && prop in obj && obj[prop] == value) {
        if (retprop && retprop in obj) {
            return obj[retprop];
        } else {
            return obj;
        }
    } 

    //Object - search all properties in object
    else if (typeof obj == "object"){
        for (let key of Object.keys(obj)){

            //Success case - one of the object props matches the value. No specific prop is given.
            if (obj[key] === value && !prop) {
                if (retprop && retprop in obj) {
                    return obj[retprop];
                } else {
                    return obj;
                }
            }

            let val = searchForValue(value, obj[key], prop, retprop);

            if (val != null){
                return val;
            }
        }
        return null;
    }
    
    //Array - Loop through array
    else if (typeof obj == "array"){
        for (let arrItem of array){
             let val = searchForValue(value, arrItem, prop, retprop);

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






