const fields = require('../data/fields.json');

var results = {};

results.headPrefix = fields.config.item_prefixes.eq_head;
results.bodyPrefix = fields.config.item_prefixes.eq_body;
results.rangedPrefix = fields.config.item_prefixes.eq_ranged;
results.meleePrefix = fields.config.item_prefixes.eq_melee;
results.invPrefix = fields.config.item_prefixes.inventory;



module.exports = results;