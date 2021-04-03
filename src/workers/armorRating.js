(function() {
    const equipmentArmorFlds = (([[
        runFunction((data) => {
            return [
                data.prefixes.head + "_equipment_armor_rating",
                data.prefixes.body + "_equipment_armor_rating",
                data.prefixes.arms + "_equipment_armor_rating",
                data.prefixes.legs + "_equipment_armor_rating"
            ];
        })
    ]]));


    const armorRating = "(([[getProperty('misc.armor.attr_name') ]]))";
    const defaultArmorVal = "(([[getProperty('misc.armor.default_value') ]]))";

    const handleArmorChange = function(){
        var attrs = [...equipmentArmorFlds];

        attrs.push(armorRating);
        getAttrs(attrs, function(values){
            var setAttr = {},
                count = parseInt(defaultArmorVal, 10); //starting

            for (let fld of equipmentArmorFlds){
                let val = filterInt(values[fld]);

                if (Number.isInteger(val)){
                    count += val;
                } else {
                    setAttr[fld] = 0;
                }   
            }

            setAttr[armorRating] = count;

            setAttrs(setAttr);
        });
    };


    for (let fld of equipmentArmorFlds){
        on(`change:${fld}`, function(evInfo){
            handleArmorChange();
        });
    }


})();