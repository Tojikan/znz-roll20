const fs = require('fs');
const path = require('path');

module.exports = {
    dataFolder: './data/',
    reusableFuncs: './_resuables.js',

    /**
     * This allows you to run any function you want, including your own callbacks.
     * 
     * The function receives a single parameter which represents all data in the data folder. Filenames are used as a key to the data.
     * 
     * @param {function} fn Function to be run.
     */
    runFunction: function(fn){

        if (typeof fn !== 'function'){
            throw("runFunction error - Invalid parameter type. The parameter must be a function.");
        }
        return fn(getAllData());
    },

    /**
     * Gets a file, transforms its data.
     * @param {string} file Path to a file in the data folderto retrieve
     * @param {function} callback Callback function to transform data with. Accepts parameter which is the data retrieved from the file. Returns what is returned by the callback.
     */
    transformData: function(file, callback){
        if (typeof callback !== 'function'){
            throw("runFunction error - Invalid parameter type. The parameter must be a function.");
        }

        const data = require(this.dataFolder + '/' + file);

        return callback(data);
    },

    /**
     * Searches through all JSON files for an object with a given property that has a given value.
     * For doing a lookup for a specific object in all files
     * 
     * @param {string} prop Object property to search in.
     * @param {string} val Value of the property to search for.
     * @param {string} location Search in a specific file only. Give the string name of file without extension.
     */
    searchProperty: function(prop, val, location = null){
        let files = fs.readdirSync(this.dataFolder);
        var result = null;

        files.forEach(file => {
            if (path.extname(file) === '.json' && file.indexOf('.schema') < 0){ //ignore schema
                
                if (location !== null && path.basename(file, '.json') !== location){
                    return;
                }
                
                let data = JSON.parse(fs.readFileSync(this.dataFolder + file));
                found = recursiveSearch(prop, val, data);

                if (found){
                    result = found;
                } 
            }
        });

        if (result){
            return result;
        } else {
            throw `Did not locate an object with Property '${prop}' that had value '${val}'`;
        }
    },

    /**
     * Retrieve the contents of a file. Assumes the file either is JSON or exports JSON.
     * 
     * @param {string} fileName Name of a file to retrieve
     * @param {string} folder Containing folder. The trailing slash (/) should not be added here as it is added automatically. Defaults to query folder.
     * @param {string} extension Extension of the file. A period (.) gets prepended to the extension. Defaults to JSON.
     */
    getFile: function(fileName,  extension = 'json', folder = this.dataFolder,){
        let importPath = folder + '/' + fileName + '.' + extension;
        
        if (fs.existsSync(importPath)){
            let importData = require(importPath);

            return JSON.stringify(importData);
        } else {
            throw `File '${importPath}' does not exist!`;
        }
    },

    /**
     * Access property using standard dot notation. All data in specified folder gets added into a struct, where each filename is a property in the struct.
     */
    getProperty: function(notation, folder = this.dataFolder, ext = '.json') {
        let data = {};
        let files = fs.readdirSync(folder);

        files.forEach(file => {
            if ((path.extname(file) === ext) && file.indexOf('schema') < 0){ //ignore schema
                let filename = path.basename(file, ext);
                data[filename] = JSON.parse(fs.readFileSync(folder + file));
            }
        });

        //https://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
        return notation.split('.').reduce((o,i)=>o[i], data);
    },
    /**
     * Get the code of a function in the specified function file as a string
     */
    getFunction: function(funcName){
        delete require.cache[require.resolve(this.reusableFuncs)]; //clear cache 
        let funcData = require(this.reusableFuncs);
        return funcData[funcName].toString();
    }
}

/**
 * Recursive function to handle the searching for any property in a given object.
 * 
 * @param {string} prop Object property to search in.
 * @param {string} val Value of the property to search for.
 * @param {object} object the data object
 * @returns the object if found else null if not found.
 */
function recursiveSearch(prop, val, object){
    // Fail case - nothing has been found
    if (object == null){
        return null; 
    }

    //Success case - find property
    if (typeof object === "object" && prop in object && object[prop] == val) {
        return object;
    }     
    //Array - search search array
    else if (typeof object == "array"){
        for (let arrItem of array){
            let found = recursiveSearch(prop, val, arrItem);

            if (found) return found;
        }
    } 
    //Object - search all properties in object
    else if (typeof object == "object"){
        for (let key of Object.keys(object)){
            let found = recursiveSearch(prop, val, object[key]);

            if (found) return found;
        }
    }

    //End case - not an object or array
    return null;
}

//Read all files in data folder and save it in a data object with filename as key
function getAllData(){
    let data = {};
    let dataFolder = './data/';
    let files = fs.readdirSync(dataFolder);

    files.forEach(file => {
        //If JSON, simply parse it.
        if (path.extname(file) === '.json' && file.indexOf('schema') < 0){ //ignore schema
            let filename = path.basename(file, '.json');
            delete require.cache[require.resolve(dataFolder + file)]; //clear cache for json before it gets used by dataqueries
            data[filename] = JSON.parse(fs.readFileSync(dataFolder + file));
        //If JS, save exports
        } else if (path.extname(file) === '.js'){
            
            let filename = path.basename(file, '.js');

            data[filename] = require(dataFolder + file);
            delete require.cache[require.resolve(dataFolder + file)]; //clear cache
        }
    });

    return data;
}