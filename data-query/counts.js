const fields = require('../data/fields.json');

var results = [];

for (let count of fields.counters) {
    results.push({
        attr_name: count.attr_name,
        attr_list: fields[count.counts].map( (x)=>{ return ( count.counts_max ? x.attr_name + "_max" : x.attr_name ) }) //counts should refer to an array in fields.json
    })
}

module.exports = results;