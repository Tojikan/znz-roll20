const equipmentStatsFields = [[{dataquery:'equipmentStats'}]];

var equippedMods = equipmentStatsFields.modFields,
    bonusFields = equipmentStatsFields.bonusFields;

var changeText = 'change:' + equippedMods.join(' change:');

on(changeText, function(eventInfo){
    getAttrs(equippedMods, function(values){

        // Reduce bonusFields (attrs and skills) into an object
        var attrSet = bonusFields.reduce( (current, item) => {
            
            current[item + "_bonus"] = 0;
            
            //check if values has this selected. If so, added it.
            for (mod of equippedMods){
                if ( values[mod] == item && values[mod + "_mod"].length){
                    current[item + "_bonus"] += parseInt(values[mod + "_mod"], 10);
                }
            }
            
            //check if 0 or positive/negative
            current[item + "_bonus_check"] = (current[item + "_bonus"] == 0) ? "none" : (current[item + "_bonus"] < 0) ? "negative" : "positive";
            return current;

        }, {});

        setAttrs(attrSet);
    });
});