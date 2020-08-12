const data = require('../data/fields.json');


let result = [];

for (const attr of data.attributes){
    result.push({
        name: attr.display_name,
        value: attr.attr_name
    });
}

for (const attr of data.proficiencies){
    result.push({
        name: attr.display_name,
        value: attr.attr_name
    });
}

for (const attr of data.skills) {
    result.push({
        name: attr.display_name,
        value: attr.attr_name
    });
}

module.exports = result;

