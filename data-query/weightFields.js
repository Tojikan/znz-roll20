const fields = require('../data/fields.json');

var individual = '',
    quantity = '';

for (let itm of fields.item.standard) {
    if (itm.canonical == "itemweight") {
        individual = itm['attr_name'];
    }    
    if (itm.canonical == "itemquantity") {
        quantity = itm['attr_name'];
    }
}


module.exports = {
    individual: fields.config.item_prefixes.inventory + "_" + individual,
    quantity : fields.config.item_prefixes.inventory + "_" + quantity,
    total : fields.inventory.weight.attr_name,
    max : fields.inventory.max_weight.attr_name,
    check : fields.inventory.weight.attr_name + "_check"
};