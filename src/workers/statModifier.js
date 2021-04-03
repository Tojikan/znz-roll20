(function() {
    const statModifiers = (([[
        runFunction((data) => {
            var results = [];
            const status = data.misc.stat_effects;
            const equipment = data.items.fields.equipment;
            const armorTypes = data.items.armorTypes;
            const prefixes = data.prefixes;


            for (let i = 0; i < status.count; i++){
                results.push(`${status.attr_name}_${i}`);
            }

            for (let field of equipment){
                if (field.type == 'stat_repeater'){

                    var armor = field;

                    for (var i = 0; i < armor.count; i++){
                        for (let type of armorTypes){
                            let prefix = prefixes[type.value];
                            
                            results.push(`${prefix}_${armor.attr_name}_${i}`);
                        }
                    }
                }
            }

            return results;
        })
    ]]));
    const statBonusFields = (([[
        transformData('statModOptions', (data)=>{
            return data.map((val)=>{
                return val.value + "_bonus";
            });
        })
    ]]));
    const statBonusOptions = (([[
        transformData('statModOptions', (data)=>{
            return data.map((val)=>{
                return {
                    name: val.name,
                    value: val.value + "_bonus"
                };
            });
        })
    ]]));
    const statModTracker = "(([[getProperty('misc.stat_mod_tracker.attr_name')]]))";

    
    const getStatNameFromBonusFld = function(bonusFld){
        for (fld of statBonusOptions){
            if (fld.value == bonusFld){
                return fld.name;
            }
        }

        return "";
    }

    /**
     * Note: We do a total recalculation of all fields on change. Previously tried the 1 by 1 (adding a single change to a bonus field) but having a single desync between
     * bonus fields and the true calculation caused the entire thing to break AND be unfixable without manually going into sheet attributes.
     * 
     */
    const handleStatModChange = function(){
        var attrs = statModifiers.concat(statModifiers.map((val) => { return val + "_mod"; })); 

        attrs = attrs.concat(statBonusFields);

        getAttrs(attrs, function(values){

            var setAttr = {};

            // loop over stat modifier select fields
            for (let mod of statModifiers){
                // only include ones with option selected
                if (mod in values && values[mod].length){

                    let selectedAttr = values[mod] + "_bonus";
                    
                    if (!setAttr.hasOwnProperty(selectedAttr)){
                        setAttr[selectedAttr] = 0;
                    }

                    let modValue = mod + "_mod";

                    // Add up mod values
                    if (modValue in values){
                        modValue = filterInt(values[modValue]);
                        
                        if (Number.isInteger(modValue)){
                            setAttr[selectedAttr] += modValue;

                            var setValue = setAttr[selectedAttr];

                            setAttr[selectedAttr + "_check"] = ( setValue > 0 ? "pos" : (setValue < 0 ? "neg" : "") );
                        }
                    }
                }
            }

            
            //set statmodtracker text
            var trackText = "";
            for (let key in setAttr){
                var displayName = getStatNameFromBonusFld(key);

                if (displayName.length){
                    trackText += `${displayName}: ${setAttr[key]} \n`;
                }
            }
            setAttr[statModTracker] = trackText;


            setAttrs(setAttr);

        });
    }

    for (let mod of statModifiers){
        on( `change:${mod}`, function(evInfo){
            handleStatModChange();
        });
        on( `change:${mod}_mod`, function(evInfo){
            handleStatModChange();
        });
    }


})();