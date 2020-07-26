const data = require('../data/fields.json');


let result = [];

for (const attr of data.attributes){
    result.push({
        name: attr.display_name,
        value: attr.attr_name
    });
}

for (const attr of data.proficiencies){
    if (attr['equipment_affectable'] !== undefined && attr.equipment_affectable){
        result.push({
            name: attr.display_name,
            value: attr.attr_name
        });
    }
}

module.exports = result;

