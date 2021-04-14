const fields = require('../data/fields.json');

var results = [];

results = fields.stats.reduce( (current, item) => { 
        current[item.attr_name] = item.display_name;
        
        return current;
    }, {});


module.exports = results;