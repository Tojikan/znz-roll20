(function(){
    const abilityData = (([[getFile('abilities')]])),
        flawData = (([[getFile('flaws')]])),
        abilityAttr = "(([[getProperty('misc.quirks.ability_attr')]]))",
        flawAttr = "(([[getProperty('misc.quirks.flaw_attr')]]))",
        repeatingAbility = "repeating_" + abilityAttr,
        repeatingFlaw = "repeating_" + flawAttr,
        randomizeFlawBtn = "(([[getProperty('misc.actions.randomizeFlaw')]]))",
        randomizeAbilityBtn = "(([[getProperty('misc.actions.randomizeAbility')]]))";

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