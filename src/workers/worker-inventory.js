const weightFields = [[{dataquery:'weightFields'}]];

var individual = weightFields.individual,
    quantity = weightFields.quantity,
    max = weightFields.max,
    total = weightFields.total,
    check = weightFields.check;

//Expand all item cards
on("clicked:inventoryshow", function(){
    getSectionIDs("inventory", function(idArray) {
        var toggleArray = idArray.map(x => "repeating_inventory_" + x + "_expand_toggle");

        getAttrs(toggleArray, function(value){
            var attrSet = {}

            Object.keys(value).forEach(val => attrSet[val] = "on");
            setAttrs(attrSet);
        });
    });

});

//Collapse Item Cards
on("clicked:inventoryhide", function(){
    getSectionIDs("inventory", function(idArray) {
        var toggleArray = idArray.map(x => "repeating_inventory_" + x + "_expand_toggle");

        getAttrs(toggleArray, function(value){
            var attrSet = {}

            Object.keys(value).forEach(val => attrSet[val] = "off");
            setAttrs(attrSet);
        });
    });
});

// Repeating Sum of inventory weight
on('change:repeating_inventory:' + individual + ' change:repeating_inventory:' + quantity +' remove:repeating_inventory', function() {
    repeatingSum(total,"inventory",[individual, quantity]);
});

// Set hidden checkbox if weight exceeds max to turn it red
on('change:' + total, function() {
    getAttrs([total, max, check], function(value){
        let exceedWeight = false,
            attrSet = {};

        if (value[total] > value[max]) {
            exceedWeight = true;
        }

        attrSet[check] = (exceedWeight) ? "on" : "off";

        setAttrs(attrSet);
    })

});
