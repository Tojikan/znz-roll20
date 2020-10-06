"use strict";



module.exports = {
    dataFolder: './data/',

    /**
     * 
     * @param {*} args 
     */
    runFunction: function(args){
        if (typeof args !== 'function'){
            console.error("runFunction error - Invalid parameter type. The parameter must be a function.");
            return '';
        }

        const req = require;
        return args();
    },
    /**
     * 
     * @param {*} argsObj 
     */
    queryData: function(argsObj){
        var args;
        
        try{
            args = eval(argsObj);
        } catch(err) {
            console.error("Data query error - Unable to parse args. Args must be a string representation of a valid JavaScript object!");
            return ''
        }

        if (typeof args !== 'object'){
            console.error("Data query error - Args was parsed but invalid type! Args must be a valid JavaScript object specifying the query to be run and its parameters.");
            return '';
        }
        
        var argKeys = Object.keys(args);

        if (argKeys.length > 0){

            for (const key of argKeys) {

                if (typeof this[key] === 'function'){
                    return this[key](args[key]);
                }
            }

            console.log("Data query warning - no query function matching the provided args was found.")
            return '';
        } else {
            console.log("Data query warning - no query function was specified. ");
            return '';
        }
    }
};