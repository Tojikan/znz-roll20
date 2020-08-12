const data = require('../data/fields.json');


var result = {};

result.melee = [{name:"", value:""}];
result.ranged = [{name:"", value:""}];


for (const attr of data.proficiencies){
    if (attr.affects_combat === true && attr.combat_type in result){
        result[attr.combat_type].push({
            name: attr.display_name,
            value: attr.attr_name
        });
    }
}


module.exports = result;

