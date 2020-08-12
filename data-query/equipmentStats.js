const data = require('../data/fields.json'),
    global = require('./_global.js'),
    statOptions = require('./equipmentStatsOptions');


var results = {};
    
results.modFields = [];
results.bonusFields = [];

for (const field of data.item.equipment){
    if ("canonical" in field && field.canonical == "equipment_stat" && field.field_type == "repeater" && field.has_mod){
        
        let count = parseInt(field.count, 10);

        for (let i = 0; i < count; i++){
            results.modFields.push(global.headPrefix + '_' + field.attr_name + '_' + i.toString());
            results.modFields.push(global.bodyPrefix + '_' + field.attr_name + '_' + i.toString());
            results.modFields.push(global.headPrefix + '_' + field.attr_name + '_' + i.toString() + '_mod');
            results.modFields.push(global.bodyPrefix + '_' + field.attr_name + '_' + i.toString() + '_mod');
        }
    }
}

results.bonusFields = statOptions.map((x) => {return x.value});



module.exports = results;

