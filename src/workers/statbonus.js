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
})();