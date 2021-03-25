(function(){
    const prefixes = (([[getFile('prefixes')]]));
    const itemFields = (([[transformData('items', (data)=>{
        const fields = data.fields;
        const categories = ['melee', 'ranged'];
        var result = [];
        
        for (const key in fields){
            if (categories.includes(key)){
                for (const fld of fields[key]){
                    result.push(fld.attr_name);

                    if (fld.type == "line_max"){
                        result.push(fld.attr_name + "_max");
                    }
                }
            } else if (key == 'equipment'){

                for (const fld of fields[key]){
                    if (fld.attr_name == "equipment_stat_bonus"){
                        for (let i = 0; i < fld.count; i++){
                            result.push(fld.attr_name + "_" + i);
                            result.push(fld.attr_name + "_" + i + "_mod");
                        }
                    } else {
                        result.push(fld.attr_name);
                    }

                }
            } else if (key == 'subtypes'){
                for (const fld in fields[key]){
                    result.push(fields[key][fld]);
                }
            } else {
                result.push(fields[key].attr_name);
            }
        }
        return result;
    })]]));
    const ignoreEmpty = [
        "(([[getProperty('items.fields.type.attr_name')]]))",
        "(([[getProperty('items.fields.subtypes.melee')]]))",
        "(([[getProperty('items.fields.subtypes.ranged')]]))",
        "(([[getProperty('items.fields.subtypes.armor')]]))",
        "(([[searchProperty('canonical', 'rangedAmmoType').attr_name]]))"
    ];
    const equipTypes = (([[ transformData('items', (data)=>{
        const types = data.equipTypes;
        var results = [];

        for (type in types){
            results.push(types[type]);
        }

        return results;
    })]]));
    

    
    const getButtonRowId = function(eventInfo){
        var underscoreIndex = eventInfo.sourceAttribute.lastIndexOf("_");
        return eventInfo.sourceAttribute.substr(0, underscoreIndex);
    };

    const prefixFields = function(prefix, arr){
        return arr.map((x)=>{
            return `${prefix}_${x}`;
        });
    };

    const fieldsIsEmpty = function(fields, data){
        for (const fld of fields){
            if (!ignoreEmpty.includes(fld) && typeof data[fld] !== 'undefined' && data[fld].length > 0) { //dont check item type
                return false;
            }
        }

        return true;
    };
    
    const equipItem = function(rowId, type){
        const equippedFields = prefixFields(prefixes[type], itemFields),
            inventoryFields = prefixFields("repeating_inventory_" + prefixes.inventory, itemFields),
            bothFields = inventoryFields.concat(equippedFields);

        getAttrs(bothFields, function(values){
            const invEmpty = fieldsIsEmpty(inventoryFields, values);
            const eqEmpty = fieldsIsEmpty(equippedFields, values);

            if (invEmpty){ return;} //Do nothing if item to be equipped is empty
            
            var attrSet = {};

            // transpose inventory into equipped fields
            for (const fld of itemFields){
                attrSet[prefixes[type] + "_" + fld] = values[ "repeating_inventory_" + prefixes.inventory + "_" + fld];
            }

            // transpose equipped into a new inventory row if its not empty
            if (!eqEmpty){
                for (const fld of itemFields){
                    attrSet[rowId + "_" + prefixes.inventory + "_" + fld] = values[prefixes[type] + "_" + fld];
                }
            }

            // removeRepeatingRow(rowId); //remove current
            console.log(values);
            console.log(attrSet);
            setAttrs(attrSet);
        });
    };

    const unequipItem = function(type){
        const equippedFields = prefixFields(prefixes[type], itemFields);

        getAttrs(equippedFields, function(values){
            const eqEmpty = fieldsIsEmpty(equippedFields, values);

            if (eqEmpty){ return; }

            const newInvRowId = generateRowID();
            var attrSet = {};

            for (const prop in values){
                //Transpose equipped to a new inventory row
                var newProp = prop.replace(type, "repeating_inventory_" + newInvRowId + "_" + prefixes.inventory);
                attrSet[newProp] = values[prop];

                attrSet[prop] = ""; //clear current

            }
            setAttrs(attrSet);
        });
    }

    equipTypes.forEach(type => {
        on(`clicked:unequip${type}`, function(){
            unequipItem(type);
        });

        on(`clicked:repeating_inventory:equip${type}`, function(evInfo){
            const rowId = getButtonRowId(evInfo);
            equipItem(rowId, type);
        });
    });
})();