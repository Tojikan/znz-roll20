require("@babel/register");
const fs = require('fs');
const path = require('path');
import {fields as character} from './src/model/character';
import * as types from './src/model/itemtypes';
import { capitalize } from 'lodash';

// When retrieving data from models, we want to clear cache and require() (instead of imports) so we can
// get up to date data if the file was changed



/**
 * Clear the require cache of all files in a folder 
 * 
 * @param {*} dataFolder folder to clear
 */
const clearDataCache = function(dataFolder){
    let dataFiles = fs.readdirSync(dataFolder);

    dataFiles.forEach(file => {
        if (path.extname(file) === '.json' || path.extname(file) === '.js'){
            delete require.cache[require.resolve(dataFolder + file)];
        }
    });
}

/**
 * Imports files for our sheet model in a folder into a single object where we can refer to it.
 * JSON files are saved in the result
 * JS Exports - only exported 'fields' and 'options' are saved into th eobject. 
 * 
 * Filename is used as the key.
 * 
 * @param {filepath} dataFolder - folder to import
 * @returns 
 */
const getModel = function(dataFolder){
    //make sure data folder ends with backslash
    var lastChar = dataFolder.substr(-1);
    if (lastChar !== '/'){
        dataFolder += '/';
    }


    clearDataCache(dataFolder);
    
    let files = fs.readdirSync(dataFolder);
    
    let data = {
        fields: {},
        options: {}
    };

    files.forEach(file => {
        //If JSON, simply parse it.
        if (path.extname(file) === '.json' && file.indexOf('schema') < 0){ //ignore schema
            
            delete require.cache[require.resolve(dataFolder + file)]; //clear cache first before we use it.
            let filename = path.basename(file, '.json');


            data[filename] = JSON.parse(fs.readFileSync(dataFolder + file));
        //If JS, save exports
        } else if (path.extname(file) === '.js'){
            
            delete require.cache[require.resolve(dataFolder + file)];
            let filename = path.basename(file, '.js');
            let exported = require(dataFolder + file);

            console.log(exported)

            if ('fields' in exported){
                data.fields[filename] = exported['fields'];
            } 
            
            if ('options' in exported){
                data.options[filename] = exported['options']
            }
        }
    });

    return data;
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
        if (typeof obj == 'string'){
            return obj;
        }

        if(obj['label'] !== undefined){
            return obj['label'];
        }

        if(obj['id'] !== undefined){
            return capitalize(obj['id']);
        }

        return '';
    },

    removeAmmo: function(obj){
        return obj.replace('ammo_', "");
    },

    attach: function(obj, prefix, suffix){
        let result = obj;

        if (prefix){
            result = `${prefix}_${result}`;
        }

        if (suffix){
            result = `${result}_${suffix}`;
        }

        return result;
    },

    exportItem: function(obj){
        let result = '';

        for (let key in obj){
            let fld = obj[key];

            if ('id' in fld){
                let id = fld.id;
                result += ` ${id}='@{${id}}' `;
            }
        }

        return result;
    }
};

//Headers to inject into top of Sass file.
//Gulp process needs to be stopped for changes to take.
const sassHeaders = `
    $maxEquipmentSlots: ${character.equipmentslots.max};

    $abilityCount: ${Object.keys(character.ability.options).length};


    $itemTypes: ${Object.keys(types).reduce((prev, key) =>{
        prev.push(types[key].id);
        return prev;
    }, []).join(',')};
`;

/**
 * Get Character Model
 * @returns Character Model
 */
const getCharacter = function(){
    clearDataCache('./src/models/');
    const character = require('./src/models/characterModel').CharacterModel;

    return character.toJson();
}


module.exports = {
    getModel: getModel,
    filters:  filters,
    sassHeaders: sassHeaders,
    capitalize: capitalize,
    getCharacter: getCharacter
};


