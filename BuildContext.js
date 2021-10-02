const fs = require('fs');
const path = require('path');


class BuildContext{
    constructor(dataFolder, fieldsKey = 'fields'){
        //make sure data folder ends with backslash
        var lastChar = dataFolder.substr(-1);
        if (lastChar !== '/'){
            dataFolder += '/';
        }

        this.dataFolder = dataFolder;
        this.fieldsKey = fieldsKey;
    }

    /**
     * Reads all JSON files and exported JS in data folder.
     * In exported JS, we only consider the "fields" key in the exported object.
     * 
     * @returns Object where each key is the filename and the value is the JSON or JS Export.
     */
    getFields(){
        let data = {};
        let files = fs.readdirSync(this.dataFolder);

        files.forEach(file => {
            //If JSON, simply parse it.
            if (path.extname(file) === '.json' && file.indexOf('schema') < 0){ //ignore schema
                
                delete require.cache[require.resolve(this.dataFolder + file)]; //clear cache first before we use it.
                let filename = path.basename(file, '.json');


                data[filename] = JSON.parse(fs.readFileSync(this.dataFolder + file));
            //If JS, save exports
            } else if (path.extname(file) === '.js'){
                
                delete require.cache[require.resolve(this.dataFolder + file)];
                let filename = path.basename(file, '.js');
                let exported = require(this.dataFolder + file);

                if (this.fieldsKey in exported){
                    data[filename] = exported[this.fieldsKey];
                }
            }
        });

        return data;
    }
}

// Nunjucks Filters
const filters = {
    getAttr: function(obj){
        if(obj['id'] !== undefined){
            return obj['id'];
        }
        return typeof obj == 'string' ? obj : '';
    },

    // Return 
    getLabel: function(obj){
        if(obj['label'] !== undefined){
            return obj['label'];
        }
        return typeof obj == 'string' ? obj : '';
    }
}

module.exports = {
    BuildContext: BuildContext,
    filters:  filters
};