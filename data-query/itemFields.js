const fields = require('../data/fields.json'),
    item = fields.item;

var results = {},
    fieldList = [],
    ignoreEmpty = ""; //when doing empty checks for unequipping items, we ignore item type since it should be stable. 


for (const prop in item){
    if (Array.isArray(item[prop])){
        for (const field of item[prop]) {
            fieldList = fieldList.concat(getAttrsForField(field))
        }
    } else if(typeof item[prop] == 'object') {
        fieldList =fieldList.concat(getAttrsForField(item[prop]))
    }
}


results.fieldList = fieldList;
results.ignoreEmpty = ignoreEmpty;

module.exports = results;


function getAttrsForField(field) {
    var result = [];

    if( "canonical" in field && field.canonical == "item_type"){ ignoreEmpty = field.attr_name};
    
    if (field.field_type == 'repeater'){
        let count = parseInt(field.count, 10);

        for (let i = 0; i < count; i++){
            result.push(field.attr_name + '_' + i.toString());
            if ('has_mod' in field && field.has_mod){
                result.push(field.attr_name + '_' + i.toString() + '_mod');
            }
        }
    } else {
        result.push(field.attr_name);

        if ('has_max' in field && field.has_max == true){
            result.push(field.attr_name + "_max");
        }
    }

    return result;
}