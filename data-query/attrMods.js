const fields = require('../data/fields.json');

var results = [];

results = fields.attributes.map((x)=>{
    return x.attr_name;
});


module.exports = results;