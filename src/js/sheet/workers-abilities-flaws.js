var abilitiesArr = {
        default:
            "Select an ability to see its description.",
        bullseye: 
            "All that time throwing darts and shooting guns paid off. Just like you knew it would. \n\n + Know exactly how much a ranged attack success requires. \n + Ranged weapons critically strike on a natural 9.",
        lucky: 
            "Lady luck smiles on you. She offers a damn good safety net. \n\n + 3 times a play session, you can re-roll any roll. You can choose which roll to accept. ",
        stable: 
            "Everyone needs a shoulder to cry on. You just happen to have a good shoulder. \n\n + When your sanity breaks, choose which traumatic response action to take. \n + You can give your sanity points to other players.",
        martialartist: 
            "When they said self-defense, you weren't expecting this is what you'd be defending against. \n\n + Know exactly how much a melee attack success requires. \n + Successful dodging allows you to make a free melee attack roll.",
        motivational: 
            "Just because the dead are rising, doesn't mean positive thinking is less valuable. \n\n + 3 times a day, give someone else a +2 bonus on their next roll as a free action.",
        highoctane: 
            "'Relax. Take a chill pill. Don't hurt yourself.' they said. Well, you're all out of chill pills and there's zombies to be a-killin'. \n\n + You can take one additional combat action on your turn in exchange for 3 energy or 3 health.",
        knowledgeable: 
            "They said the internet's full of useless facts. Well guess who's dead and no longer able to laugh now? \n\n + You can attempt any skill action for a skill you don't possess by passing an intelligence check first. You must still roll the skill check after. \n + You can not have any additive bonuses or have a critical success for any skill action done this way.",
}



var flawsArr = {
        default:
            "Select a flaw to see its description.",
        nearsighted: 
            "Glasses. What, did you think you would never have to worry about them during an apocalypse?. \n\n + Occasionally, your glasses may break. Especially during intense combat. \n + Once your glasses are broken, you can attempt to fix them or scavenge for other glasses with matching prescriptions. \n + Once your glasses are broken, reduce all ranged attack rolls by half.",
        curious: 
            "They say curiosity killed the cat. Well now the cat can come back and eat your brains. \n\n + Occasionally, you will have an urge to explore or visit an certain area. \n + You can attempt to resist this urge with a tenacity check and spending 3 sanity. You can spend additional sanity to improve your tenacity check.",
        sickly: 
            "Well, at least there's no insurance to deal with. \n\n + Occasionally, you require special medicine for a condition. This will give you a quest to scavenge for this medicine. \n + If you ignore this quest, take 5 damage. This quest will appear again shortly.",
        clumsy: 
            "It's not unusual to have two left feet anymore. You can find body parts of all orientations really easily now.. \n\n + When doing actions such as sneaking or scavenging, you will occasionally cause a disturbance which leads to an encounter. \n + Occasionally, you will slip or trip while falling.",
        addict: 
            "TBA \n\n + Have constant urges to pursue a substance addiction, especially in its presence.  on your turn in exchange for 3 energy or 3 health.",
        unlucky: 
            "Just when life during the undead apocalypse seems to be looking in a slightly more positive direction than down. \n\n + 3 times a play session, the ZM will force you to re-roll your dice, making you take the lowest roll.",
}




on("change:repeating_abilities:ability", function(eventInfo){
    getAttrs([
        "repeating_abilities_ability"
    ], function(value){
        var abilityName = value["repeating_abilities_ability"];


        if (abilityName in abilitiesArr){
            setAttrs({
                repeating_abilities_abilitytext: abilitiesArr[abilityName]
            });
        }
    });
});

on("change:repeating_flaws:flaw", function(eventInfo){
    getAttrs([
        "repeating_abilities_flaw"
    ], function(value){
        var flawName = value["repeating_abilities_flaw"];


        if (flawName in flawsArr){
            setAttrs({
                repeating_abilities_flawtext: flawsArr[flawName]
            });
        }
    });
});









