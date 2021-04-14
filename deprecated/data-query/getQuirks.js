const quirks = require('../data/quirks.json');
const fields = require('../data/fields.json');

var results = {
    abilityList: {},
    flawList: {}
}

for (const ab of quirks.abilities) {
    results.abilityList[ab.value] = ab.description;
}

for (const fl of quirks.flaws) {
    results.flawList[fl.value] = fl.description;
}

results["repeatingAbility"] = "repeating_" + fields.quirks.abilities.repeating_attr;
results["repeatingFlaw"] = "repeating_" + fields.quirks.flaws.repeating_attr;


results["fullAbilityAttr"] = "repeating_" + fields.quirks.abilities.repeating_attr + "_" + fields.quirks.abilities.attr_name;
results["fullAbilityTextAttr"] = "repeating_" + fields.quirks.abilities.repeating_attr + "_" + fields.quirks.abilities.attr_name + "_" + fields.quirks.abilities.text_attr;
results["abilityAttr"] = fields.quirks.abilities.attr_name;

results["fullFlawAttr"] = "repeating_" + fields.quirks.flaws.repeating_attr + "_" + fields.quirks.flaws.attr_name;
results["fullFlawTextAttr"] = "repeating_" + fields.quirks.flaws.repeating_attr + "_" + fields.quirks.flaws.attr_name + "_" + fields.quirks.flaws.text_attr;
results["flawAttr"] = fields.quirks.flaws.attr_name;

module.exports = results;