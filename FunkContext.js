const fs = require('fs');
const path = require('path');


class FunkContext{
    constructor(dataFolder, funcs={}, reusables={}, logError = true){

        var lastChar = dataFolder.substr(-1);
        if (lastChar !== '/'){
            dataFolder += '/';
        }

        this.dataFolder = dataFolder;
        this.reusables = reusables;
        


        if (!fs.existsSync(this.dataFolder)){
            throw `${this.dataFolder} is not a valid path!`;
        }

        this.funcs = {
            ...funcs,
            data: this.getData(), //so we can reference properties directly through "data."
            getReusable: function(funcName){ //Retrieve a reusable variable or function
                
                if (funcName in this.reusables){
                    return this.reusables[funcName].toString();
                }
                
                return '';
            }.bind(this) //bind it to parent scope
        };

        this.logError = logError;
    }


    /**
     * Reads all JSON and JS Exports in the data folder.
     * 
     * @returns Object where each key is the filename and the value is the JSON or JS Export.
     */
    getData(){
        let data = {};
        let files = fs.readdirSync(this.dataFolder);

        files.forEach(file => {
            //If JSON, simply parse it.
            if (path.extname(file) === '.json' && file.indexOf('schema') < 0){ //ignore schema
                let filename = path.basename(file, '.json');
                delete require.cache[require.resolve(this.dataFolder + file)]; //clear cache for json before it gets used by dataqueries
                data[filename] = JSON.parse(fs.readFileSync(this.dataFolder + file));
            //If JS, save exports
            } else if (path.extname(file) === '.js'){
                
                let filename = path.basename(file, '.js');

                data[filename] = require(this.dataFolder + file);
                delete require.cache[require.resolve(this.dataFolder + file)]; //clear cache
            }
        });

        return data;
    }

    /**
     * Clears the require.cache for the data folder. This should be run prior to any Funks
     */
    clearDataCache(){
        let dataFiles = fs.readdirSync(this.dataFolder);

        dataFiles.forEach(file => {
            if (path.extname(file) === '.json' || path.extname(file) === '.js'){
                delete require.cache[require.resolve(this.dataFolder + file)];
            }
        });
    }

    /**
     * Main connection point between Funks and Gulp. 
     * 
     * We use a regex to capture a pattern. Gulp-replace calls a function and replaces the pattern with the function result.
     * Here, we take the capture, run a limited eval() on the capture and return results of the eval which is then used in gulp-replace
     * 
     * 
     * @param {string} match The whole regex match, passed into here by gulp-replace. Unused, but gulp-replace will alway pass it. 
     * @param {*} capture Anything in the main capture group. This should be a function or variable call to this.funcs
     * 
     * @returns the text to be output into the built file.
     */
    doFunk(match, capture){
        this.clearDataCache();

        if (capture.length){
            try {
                const result = eval('this.funcs.' + capture); //Scope our eval to this.funcs, thus limiting our eval to only using our predetermined functions.
        
                if (typeof result == "string" || typeof result == "number" || typeof result == "boolean" ){
                    return result;
                } else if (typeof result == 'object') {
                    return JSON.stringify(result);
                } else {
                    if (this.logError){
                        console.error(`DoFunks Warning! The data query '${capture}' did not return a valid value. Replaced capture with empty string instead.`)
                    }
                }
                
            } catch(e) {
                if (this.logError){
                    console.error(e);
                }
            }
        }
        return '';
    }
}

module.exports = Funks;