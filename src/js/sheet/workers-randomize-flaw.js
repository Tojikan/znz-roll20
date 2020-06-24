//This has to be included AFTER workers-abilities-flaws.js
//Randomizes a flaw

on("clicked:randomizeflaw", function(){
    let keys = Object.keys(availableFlaws);

    let randomKey = keys[keys.length * Math.random() << 0];

    //Prevent it for being the Default option. 
    while (randomKey === "default"){
        randomKey = keys[keys.length * Math.random() << 0];
    }

    var newFlawId = generateRowID();
    var newFlaw = {};

    newFlaw["repeating_flaws_" + newFlawId + "_flaw"] = randomKey;

    setAttrs(newFlaw);

});