(function(){
    const abilityData = (([[getFile('abilities')]])),
        flawData = (([[getFile('flaws')]])),
        abilityAttr = "(([[getProperty('misc.quirks.ability_attr')]]))",
        flawAttr = "(([[getProperty('misc.quirks.flaw_attr')]]))",
        repeatingAbility = "repeating_" + abilityAttr,
        repeatingFlaw = "repeating_" + flawAttr,
        randomizeFlawBtn = "(([[getProperty('misc.actions.randomizeFlaw')]]))",
        randomizeAbilityBtn = "(([[getProperty('misc.actions.randomizeAbility')]]))";


    /** Set descriptions on flaw/abilities **/

    on(`change:${repeatingAbility}:${abilityAttr}`, function(event){
        getAttrs([
            repeatingAbility + "_" + abilityAttr
        ], function(value){
            var selectedAbility = value[repeatingAbility + "_" + abilityAttr];
            

            var ability = abilityData.find( (el) => {
                return el.value == selectedAbility;
            });
            
            if (ability){
                attrSet = {};
                attrSet[repeatingAbility + "_" + abilityAttr + "_description"] = ability.description;
                setAttrs(attrSet)
            }
        });
    });
    

    on(`change:${repeatingFlaw}:${flawAttr}`, function(event){
        getAttrs([
            repeatingFlaw + "_" + flawAttr
        ], function(value){
            var selectedFlaw = value[repeatingFlaw + "_" + flawAttr];
            

            var flaw = flawData.find( (el) => {
                return el.value == selectedFlaw;
            });
            
            if (flaw){
                attrSet = {};
                attrSet[repeatingFlaw + "_" + flawAttr + "_description"] = flaw.description;
                setAttrs(attrSet)
            }
        });
    });

    /** Randomize buttons **/

    on(`clicked:${randomizeFlawBtn}`, function(){
        var random = 0;

        //prevent randoming a 0, and fully re-randomize if so.
        while (random < 1){
            random = Math.floor(Math.random() * flawData.length);
        }


        const flaw = flawData[random];
    
        var newId = generateRowID();
        var newQuirk = {};
    
        newQuirk[repeatingFlaw + "_" + newId + "_" + flawAttr] = flaw.value;
    
        setAttrs(newQuirk);
    });

    on(`clicked:${randomizeAbilityBtn}`, function(){
        var random = 0;

        //prevent randoming a 0, and fully re-randomize if so.
        while (random < 1){
            random = Math.floor(Math.random() * abilityData.length);
        }


        const ability = abilityData[random];
    
        var newId = generateRowID();
        var newQuirk = {};
    
        newQuirk[repeatingAbility + "_" + newId + "_" + abilityAttr] = ability.value;
    
        setAttrs(newQuirk);
    });
})();