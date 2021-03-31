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

    const filterInt = function(value){
        if (/^[-+]?(\d+)$/.test(value)) {
            return Number(value)
        } else {
            return NaN
        }
    };

    const handleStatModChange = function(mod){
        var attrs = [
            mod + "_mod",
            mod
        ]

        attrs.concat(statBonusFields);
        console.log(attrs);

        getAttrs(attrs, function(values){
            console.log(values);
        });
    }

    const handleAttrChange = function(statModFld, prevAttr, newAttr){
        
        var statModAmountFld = statModFld + "_mod",
            attrs = [
                statModFld, 
                statModAmountFld
            ];

        // Case 1 - Change the stat modifier select to another stat.
        if (prevAttr.length && newAttr.length){
            let prevBonusFld = prevAttr + "_bonus";
            let newBonusFld = newAttr + "_bonus";

            attrs.push(prevBonusFld);
            attrs.push(newBonusFld);

            getAttrs(attrs, function(values){
                let prevBonus = filterInt(values[prevBonusFld]),
                    newBonus = filterInt(values[newBonusFld]),
                    statModAmount = filterInt(values[statModAmountFld]),
                    statMod = values[statModFld],
                    setAttr = {};

                if (statMod != newAttr){
                    // not sure how we got here
                    console.error("Stat Bonus Worker: attribute mis-match!");
                    alert('An error has occurred.');
                    return;
                }

                if (Number.isInteger(statModAmount)){

                    if (statModAmount !== 0){
                        prevBonus = Number.isInteger(prevBonus) ? prevBonus : 0;
                        newBonus = Number.isInteger(newBonus) ? newBonus : 0;
    
                        prevBonus -= statModAmount;
                        newBonus += statModAmount;

                        let prevBonusCheckFld = prevBonusFld + "_check";
                        let newBonusCheckFld = newBonusFld + "_check";

                        let prevBonusCheck = (prevBonus > 0) ? "pos" : (prevBonus < 0 ? "neg" : "");
                        let newBonusCheck = (newBonus > 0) ? "pos" : (newBonus < 0 ? "neg" : "");
    
                        setAttr[prevBonusFld] = prevBonus;
                        setAttr[prevBonusCheckFld] = prevBonusCheck;
                        setAttr[newBonusFld] = newBonus;
                        setAttr[newBonusCheckFld] = newBonusCheck;
                    }

                } else {
                    setAttr[statModAmountFld] = 0; //Reset Mod Amount to 0 if not a valid integer
                }

                setAttrs(setAttr);
            });
        } 
        // Case 2 - Set stat modifier select to blank
        else if (prevAttr.length && !newAttr.length){
            let prevBonusFld = prevAttr + "_bonus";
            attrs.push(prevBonusFld);

            getAttrs(attrs, function(values){
                let prevBonus = filterInt(values[prevBonusFld]),
                statModAmount = filterInt(values[statModAmountFld]),
                setAttr = {};

                if (Number.isInteger(statModAmount)){
                    prevBonus = Number.isInteger(prevBonus) ? prevBonus : 0;
                    prevBonus -= statModAmount;

                    let prevBonusCheckFld = prevBonusFld + "_check";
                    let prevBonusCheck = (prevBonus > 0) ? "pos" : (prevBonus < 0 ? "neg" : "");
                    
                    setAttr[prevBonusFld] = prevBonus;
                    setAttr[prevBonusCheckFld] = prevBonusCheck;
                } else {
                    setAttr[statModAmountFld] = 0; //Reset Mod Amount to 0 if not a valid integer
                }

                setAttrs(setAttr);
            });
        }
        // Case 3 - Set stat modifier select from blank to an attr
        else if (!prevAttr.length && newAttr.length){
            let newBonusFld = newAttr + "_bonus";
            attrs.push(newBonusFld);

            getAttrs(attrs, function(values){
                let newBonus = filterInt(values[newBonusFld]),
                statModAmount = filterInt(values[statModAmountFld]),
                setAttr = {};

                if (Number.isInteger(statModAmount)){
                    newBonus = Number.isInteger(newBonus) ? newBonus : 0;
                    newBonus += statModAmount;

                    let newBonusCheckFld = newBonusFld + "_check";
                    let newBonusCheck = (newBonus > 0) ? "pos" : (newBonus < 0 ? "neg" : "");
                    
                    setAttr[newBonusFld] = newBonus;
                    setAttr[newBonusCheckFld] = newBonusCheck;
                } else {
                    setAttr[statModAmountFld] = 0; //Reset Mod Amount to 0 if not a valid integer
                }

                setAttrs(setAttr);
            });
        }
    }

    for (let mod of statModifiers){
        on( `change:${mod}`, function(evInfo){
            handleStatModChange(mod);
        });
        on( `change:${mod}_mod`, function(evInfo){
            handleStatModChange(mod);
        });
    }




})();