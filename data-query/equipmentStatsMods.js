const data = require('../data/fields.json');


let results = [];

for (const field of data.item.equipment){
    if ("canonical" in field && field.canonical == "equipment_stat" && field.field_type == "repeater" && field.has_mod){
        
        let count = parseInt(field.count, 10);

        for (let i = 0; i < count; i++){
            results.push(field.attr_name + '_' + i.toString());
        }
    }
}

module.exports = results;

