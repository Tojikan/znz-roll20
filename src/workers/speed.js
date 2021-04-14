(function() {
    const attrMod = "(([[searchProperty('canonical', 'speedAttr', 'attributes').attr_name]]))_mod";
    const attrBonus = "(([[searchProperty('canonical', 'speedAttr', 'attributes').attr_name]]))_bonus";
    const speedAttr = "(([[getProperty('misc.speed.attr_name')]]))";
    const speedDefault = (([[getProperty('misc.speed.default_value')]]));
    const speedMax = (([[getProperty('misc.speed.max')]]));

    const handleSpeedChange = function(){
        var attrs = [attrMod, attrBonus];

        getAttrs(attrs, function(values){
            var setAttr = {};

            let mod = filterInt(values[attrMod]) || 0,
                bonus = filterInt(values[attrBonus]) || 0,
                combined = mod + bonus;
            
            var speed = speedDefault;

            if (combined < 0){
                speed += (combined);
            } else if (combined > 1 && combined < 4){
                speed = speedDefault + combined - 1;
            } else if (combined == 4){
                speed = speedDefault + combined - 2; //7 at ath:7 (+4)
            } else if (combined == 5 || combined == 6){
                speed = speedDefault + 3;
            } else if (combined == 7){
                speed = speedDefault + 4;
            }


            setAttr[speedAttr] = speed < speedMax ? speed : speedMax;
            setAttrs(setAttr);
        });
    };


    on(`change:${attrMod} change:${attrBonus}`, function(evInfo){
        handleSpeedChange();
    });
})();