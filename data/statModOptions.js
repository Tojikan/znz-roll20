const attributes = require('./attributes.json');
const proficiencies = require('./proficiencies.json');


let result = [];


for (const attr of attributes){
    result.push({
        name: attr.display_name,
        value: attr.attr_name
    });
}

for (const prof of proficiencies){
    result.push({
        name: prof.display_name,
        value: prof.attr_name
    });
}

module.exports = result;

