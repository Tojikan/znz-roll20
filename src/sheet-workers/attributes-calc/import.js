const data = require('../../../data/itemFields.json');

module.exports = data.standard.map( (val) => {
    return {
        display_name : val.display_name,
        attr_name : val.attr_name
    }
});

