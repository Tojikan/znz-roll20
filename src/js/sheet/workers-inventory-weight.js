//Update hidden ranged weight
on ('change:repeating_ranged:inv_ranged_weight remove:repeating_ranged', function(){
    repeatingSum('ranged_total_weight', 'ranged', 'inv_ranged_weight');
});

//Update hidden melee weight
on ('change:repeating_melee:inv_melee_weight remove:repeating_melee', function(){
    repeatingSum('melee_total_weight', 'melee', 'inv_melee_weight');
});

//Update hidden item weight
on ('change:repeating_inventory:inv_item_weight change:repeating_inventory:inv_item_quantity  remove:repeating_inventory', function(){
    repeatingSum('misc_total_weight', 'inventory', ['inv_item_weight', 'inv_item_quantity']);
});

//Add up weights
on ('change:misc_total_weight change:melee_total_weight change:ranged_total_weight', function(){
    getAttrs([
        'melee_total_weight',
        'misc_total_weight',
        'ranged_total_weight',
        'inventory_weight',
        'inventory_max_weight'
    ], function(values){
        let melee = values['melee_total_weight'],
            ranged = values['ranged_total_weight'],
            misc = values['misc_total_weight'],
            currentWeight = values['inventory_weight'],
            maxWeight = values['inventory_max_weight'],
            exceedWeight = false;

        let newWeight = Number(melee) + Number(ranged) + Number(misc);

        if (newWeight === currentWeight){
            return;
        }

        if (newWeight > maxWeight){
            exceedWeight = true;
        }

        setAttrs({
            ['inventory_weight']: newWeight,
            ['weight_check']: (exceedWeight) ? 1 : 0
        })

    });
});


//https://wiki.roll20.net/RepeatingSum
const repeatingSum = (destinations, section, fields) => {
    if (!Array.isArray(destinations)) destinations = [destinations.replace(/\s/g, '').split(',')];
    if (!Array.isArray(fields)) fields = [fields.replace(/\s/g, '').split(',')];
    getSectionIDs(`repeating_${section}`, idArray => {
        const attrArray = idArray.reduce((m, id) => [...m, ...(fields.map(field => `repeating_${section}_${id}_${field}`))], []);
        getAttrs([...attrArray], v => {
            const getValue = (section, id, field) => v[`repeating_${section}_${id}_${field}`] === 'on' ? 1 : parseFloat(v[`repeating_${section}_${id}_${field}`]) || 0;
            const commonMultipliers = (fields.length <= destinations.length) ? [] : fields.splice(destinations.length, fields.length - destinations.length);
            const output = {};
            destinations.forEach((destination, index) => {
                output[destination] = idArray.reduce((total, id) => total + getValue(section, id, fields[index]) * commonMultipliers.reduce((subtotal, mult) => subtotal * getValue(section, id, mult), 1), 0);
            });
            setAttrs(output);
        }); 
    }); 
};