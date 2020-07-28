const data = [[{dataquery:'getQuirks'}]]; //imported via gulp.

const abilityList = data.abilityList,
    flawList = data.flawList,
    repeatingAbility = data.repeatingAbility,
    repeatingFlaw = data.repeatingFlaw,
    abilityAttr = data.abilityAttr,
    fullAbilityAttr = data.fullAbilityAttr,
    fullAbilityTextAttr = data.fullAbilityTextAttr,
    flawAttr = data.flawAttr,
    fullFlawAttr = data.fullFlawAttr,
    fullFlawTextAttr = data.fullFlawTextAttr;


/*** Set Quirk Text ***/

on("change:" + repeatingAbility + ":" + abilityAttr, function(eventInfo){
    getAttrs([
        repeatingAbility + "_" + abilityAttr
    ], function(value){
        var abilityName = value[fullAbilityAttr];
        
        if (abilityName in abilityList){
            attrSet = {};
            attrSet[data.fullAbilityTextAttr] = abilityList[abilityName];
            setAttrs(attrSet)
        }
    });
});

on("change:" + repeatingFlaw + ":" + flawAttr, function(eventInfo){
    getAttrs([
        repeatingFlaw + "_" + flawAttr
    ], function(value){
        var flawName = value[fullFlawAttr];
        
        if (flawName in flawList){
            attrSet = {};
            attrSet[fullFlawTextAttr] = flawList[flawName];
            setAttrs(attrSet);
        }
    });
});


/*** Randomize Button ****/

on("clicked:randomizeflaw", function(){
    let keys = Object.keys(flawList);

    let randomKey = keys[keys.length * Math.random() << 0];

    //Prevent it for being the Default option. 
    while (randomKey === "none"){
        randomKey = keys[keys.length * Math.random() << 0];
    }

    var newId = generateRowID();
    var newQuirk = {};

    newQuirk[repeatingFlaw + "_" + newId + "_" + flawAttr] = randomKey;

    setAttrs(newQuirk);
});

on("clicked:randomizeability", function(){
    let keys = Object.keys(abilityList);

    let randomKey = keys[keys.length * Math.random() << 0];

    //Prevent it for being the Default option. 
    while (randomKey === "none"){
        randomKey = keys[keys.length * Math.random() << 0];
    }

    var newId = generateRowID();
    var newQuirk = {};

    newQuirk[repeatingAbility + "_" + newId + "_" + abilityAttr] = randomKey;

    setAttrs(newQuirk);

});










