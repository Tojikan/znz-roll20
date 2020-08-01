const fields = require('../data/fields.json');

var results = {}

results.meleeHitRoll = fields.hitroll.melee.attr_name;
results.rangedHitRoll = fields.hitroll.ranged.attr_name;
results.weaponFields = {};
results.combatProficiencies = [];

for (let item of fields.item.weapon){
    results.weaponFields[item.attr_name] = item.attr_name;
}

for (let item of fields.proficiencies) {
    if ("affects_combat" in item && item.affects_combat == true){
        results.combatProficiencies.push(item.attr_name);
    }
}



module.exports = results;