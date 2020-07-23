var availableAbilities = {
    default:
        "Select an ability to see its description.",
    bullseye: 
        "+ Know exactly how much a ranged attack challenge is. \n\n + Ranged weapons critically strike on a natural 9.",
    martialartist: 
        "+ Know exactly how much a melee attack challenge level is. \n\n + Successful dodging allows you to make a free melee attack roll.",
    lucky: 
        "+ 3 times a play session, you can re-roll any roll. You can choose which roll to accept. ",
    stable: 
        "+ When your sanity breaks, choose which traumatic response action to take. \n\n + You can give your sanity points to other players.",
    motivational: 
        "+ 3 times a day, give someone else a +2 bonus prior to their next roll as a free action.",
    highoctane: 
        "+ You can take one additional combat action on your turn in exchange for 3 energy.",
    knowledgeable: 
        "+ Once a day, you can attempt any skill action for a skill you don't possess by passing an intelligence check first. You must still roll the skill check after.",
    speedster:
        "+ Gain an additional 2 movement speed. \n + Gain ability to jump back one space as an action or when you attempt to dodge."
}



var availableFlaws = {
    default:
        "Select a flaw to see its description.",
    nearsighted: 
        "- Occasionally, your glasses may break. \n\n - Once your glasses are broken, you can attempt to fix them or scavenge for other glasses with matching prescriptions. \n\n - Once your glasses are broken, reduce all awareness and ranged attack rolls by half.",
    curious: 
        "- Occasionally, you will have an urge to explore or visit an certain area. \n\n - You can resist this urge by spending 10 sanity.",
    sickly: 
        "- You have a condition which requires taking 1 special medicine each day. \n\n - On days you do not take this medicine, take a third of your maximum health as damage. \n\n - Start the game with 7 of the special medicine.",
    clumsy: 
        "- When doing actions such as sneaking or scavenging, you will occasionally cause a disturbance which leads to an encounter. \n\n - Occasionally, you can slip or trip while moving.",
    alcoholic: 
        "- You have constant urges to drink alcohol once a day.   \n\n - If you fail to do so by the end of the day. you will take 2 health, sanity, and energy damage. \n\n - This damage doubles for each consecutive day you fail to do so and resets to 2 after you consume some. \n\n You cannot hit 0 through this effect. This effect will can only reduce you to 1 at most.",
    fainthearted:
        "- Occasionally, roll a tenacity check at the start of a battle. If you fail the check, your first action will be a freeze.",
    vulnerable:
        "- Roll a health check whenever you take damage. If you fail the check, take double damage.",
    unlucky: 
        "- 3 times a play session, the ZM will force you to re-roll your dice roll, making you take the lower roll.",
}




on("change:repeating_abilities:ability", function(eventInfo){
getAttrs([
    "repeating_abilities_ability"
], function(value){
    var abilityName = value["repeating_abilities_ability"];


    if (abilityName in availableAbilities){
        setAttrs({
            repeating_abilities_abilitytext: availableAbilities[abilityName]
        });
    }
});
});

on("change:repeating_flaws:flaw", function(eventInfo){
getAttrs([
    "repeating_abilities_flaw"
], function(value){
    var flawName = value["repeating_abilities_flaw"];


    if (flawName in availableFlaws){
        setAttrs({
            repeating_abilities_flawtext: availableFlaws[flawName]
        });
    }
});
});


