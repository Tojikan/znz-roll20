
//Button Actions
on("clicked:unequip_ranged_weapon", function(eventInfo){
    unequip_weapon("ranged");
});

on("clicked:unequip_melee_weapon", function(eventInfo){
    unequip_weapon("melee");
});

// Repeater Button Actions - can't have multiple underscores.
on("clicked:repeating_melee:equipmelee", function(eventInfo){
    //strip out everything after last underscore, which would be the button's name
    //gets us the row ID
    var underscoreIndex = eventInfo.sourceAttribute.lastIndexOf("_"),
        rowId = eventInfo.sourceAttribute.substr(0, underscoreIndex);

    unequip_weapon("melee");
    equip_weapon("melee", rowId)
});

on("clicked:repeating_ranged:equiprange", function(eventInfo){
    //strip out everything after last underscore, which would be the button's name
    //gets us the row ID
    var underscoreIndex = eventInfo.sourceAttribute.lastIndexOf("_"),
        rowId = eventInfo.sourceAttribute.substr(0, underscoreIndex);

    unequip_weapon("ranged");
    equip_weapon("ranged", rowId)
});




// Unequip - basically a move function. 
function unequip_weapon(type){

    var weaponFields = getWeaponFields(type, "equipped_" + type + "_"); //examples: equipped_ranged_ammo  ,  equipped_melee_durability
    
    getAttrs(weaponFields, function (values){

        //check if we actually have values in the equipped weapon. before unequipping
        var isEmpty = true;
        for (let val in values){
            if (values[val].length){
                isEmpty = false;
            }
        }
        if (isEmpty){
            return;
        }

        //Create new Row
        var newInvRowId = generateRowID();
        var newInvRowAttrs = {};

        //get the keys for inventory item and equipped item.
        var invFields = getWeaponFields(type, "repeating_" + type + "_" + newInvRowId + "_inv_" + type + "_"),
            valueFields = getWeaponFields(type, "equipped_" + type +  "_");

        // loop is shorthand for: newInvRowAttrs["repeating_" + type + "_" + newInvRowId + "_inv_" + type + "_name"] = values["equipped_" + type + "_name"];
        for (let i = 0; i < invFields.length; i++){
            newInvRowAttrs[invFields[i]] = values[valueFields[i]];
        }

        //add new row in inventory. 
        setAttrs(newInvRowAttrs);


        //struct for clearing equipped weapon.
        var fieldClearStruct = getWeaponFields(type, "equipped_" + type + "_", true) //example ['equipped_ranged_note'] : ''

        setAttrs(fieldClearStruct);
    });
}


//Equip inventory item.
function equip_weapon(type, rowId){

    var weaponFields = getWeaponFields(type, rowId + "_inv_" + type + "_"); //examples: equipped_ranged_ammo  ,  equipped_melee_durability

    getAttrs(weaponFields, function (values){

        if (Object.keys(values).length === 0) {
            return;
        }



        var fieldSetStruct = getWeaponFields(type, "equipped_" + type + "_", true), //the struct to be set
            fieldValues = getWeaponFields(type, ""); // simple array of values that we will need as keys for both fieldSetStruct and values


        for (let i = 0; i < fieldValues.length; i++){
            fieldSetStruct["equipped_" + type + "_" + fieldValues[i]] = values[rowId + "_inv_" + type + "_" + fieldValues[i]];
        }

        //set equipped and remove current.
        setAttrs(fieldSetStruct);
        removeRepeatingRow(rowId);

    });
}




/**
 * Helper in order to get arrays or structs of weapon field names needed for the various functions.
 * Lets us use a single equip weapon function as it handles both fields for ranged or melee
 * These are often used to dynamically loop over keys in a struct.
 * 
 * @param {string} type Melee or Ranged
 * @param {string} prefix String appended in front of each returned field name
 * @param {boolean} asStruct Determine if we return a struct or an array.
 */
function getWeaponFields(type, prefix, asStruct = false){
    var rangedFields = ["name", "weight", "ammo", "ammo_max", "reloads", "note"],
        meleeFields = ["name", "weight", "durability", "durability_max", "durability_rating", "note"],
        targetField = [];


    //which field array to use. 
    if (type === "ranged"){
        targetField = rangedFields;
    } else if (type === "melee"){
        targetField = meleeFields;
    }
 
    if (asStruct){
        //Return struct, in which each key is the a field name with a prefix and set the value to ""
        let resultStruct = {};

        for (let i = 0; i < targetField.length; i++) {
            resultStruct[prefix + targetField[i]] = "";
        }

        return resultStruct;
    } else{
        //Return array of field names with a prefix.
        for(let i = 0; i < targetField.length; i++){
            targetField[i]= prefix + targetField[i];
        }

        return targetField;
    }
}