const fields = require('../data/fields.json');

var results = {}

results.weaponFields = {};
results.combatProfs = [];

for (let item of fields.item.weapon){
    results.weaponFields[item.canonical] = item.attr_name;
}

for (let item of fields.proficiencies) {
    if ("affects_combat" in item && item.affects_combat == true){
        results.combatProfs.push(item.attr_name);
    }
}



module.exports = results;