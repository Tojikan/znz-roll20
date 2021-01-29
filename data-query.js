const fs = require('fs');
const path = require('path');

module.exports = {
    dataFolder: './data/',
    queryFolder: './queries',
    prefixPath: './data/prefixes.json',

    /**
     * Runs a given function for anytime you need flexibility.
     * @param {function} fn Function to be run.
     */
    runFunction: function(fn){

        if (typeof fn !== 'function'){
            throw("runFunction error - Invalid parameter type. The parameter must be a function.");
        }
        return fn();
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
     * Searches through all JSON files for an object with a 'canonical' property matching the parameter.
     * If found, returns the attr_name property of the object. Used to find any given object by a canonical name since attr_name may be changed sometimes.
     * 
     * @param {string} canonical The value in object property 'canonical' to search for.
     */
    findAttrName: function(canonical){
        let files = fs.readdirSync(this.dataFolder);
        var result = null;

        files.forEach(file => {
            if (path.extname(file) === '.json' && file.indexOf('.schema') < 0){ //ignore schema
                let data = JSON.parse(fs.readFileSync(this.dataFolder + file));
                found = searchCanonical(canonical, data);

                if (found){
                    result = found;
                } 
            }
        });

        if (result && 'attr_name' in result){
            return result.attr_name;
        } else {
            throw `Canonical property of '${canonical}' was not found in data files!`;
        }
    },

    /**
     * Property lookup in prefixes.json. Returns the value of property if found.
     * 
     * @param {string} prefix Property in the prefixes.json object.
     */
    getPrefix: function(prefix){
        const prefixes = require(prefixPath);

        if (prefix in prefixes){
            return prefixes[prefix] 
        } else {
            throw `Prefix '${prefix}' was not found in data files!`;
        }
    },

    /**
     * Retrieve the contents of a file. Assumes the file either is JSON or exports JSON.
     * 
     * @param {string} fileName Name of a file to retrieve
     * @param {string} folder Containing folder. The trailing slash (/) should not be added here as it is added automatically. Defaults to query folder.
     * @param {string} extension Extension of the file. A period (.) gets prepended to the extension. Defaults to JSON.
     */
    getFile : function(fileName, folder = this.queryFolder, extension = 'json'){
        let importPath = folder + '/' + fileName + '.' + extension;
        
        if (fs.existsSync(importPath)){
            let importData = require(importPath);

            return JSON.stringify(importData);
        } else {
            throw `File '${importPath}' does not exist!`;
        }
    },
}

/**
 * Recursive function to handle the searching for a attr_name property in a given object.
 * 
 * @param {string} attr string value of attr_name to search for in object
 * @param {object} object the data object
 * @returns string value of "attr_name" if the appropriate canonical has been located, or null if nothing has been found.
 */
function searchCanonical(attr, object){
    // Fail case - nothing has been found
    if (object == null){
        return null; 
    }

    //Success case - found canonical
    if (typeof object === "object" && "attr_name" in object && object.attr_name == attr) {
        return object;
    }     
    //Array - search search array
    else if (typeof object == "array"){
        for (let arrItem of array){
            let val = searchCanonical(canon, arrItem);

            if (val) return val;
        }
    } 
    //Object - search all properties in object
    else if (typeof object == "object"){
        for (let key of Object.keys(object)){
            let val = searchCanonical(canon, object[key]);

            if (val) return val;
        }
    }

    //End case - not an object or array
    return null;
}