(function() {
    const skills = (([[
        runFunction((data) => {
            const prof = data.proficiencies;
            const skill = data.skills;

            var result = prof.concat(skill);

            return result.map((x)=>{
                return x.attr_name;
            })
        })
    ]]));

    for (let skill of skills){
        let skillBonus = `${skill}_bonus`;
        on( `change:${skill} change:${skillBonus}`, function(){
            getAttrs([skill, skillBonus], function(values) {

                let sk = parseInt(values[skill]) || 0;
                    skb = parseInt(values[skillBonus]) || 0;

                let maxRolls = sk + skb;
                    sequence = sequenceNumber(maxRolls, '|');
                console.log(values);

                var attrSet = {
                    [skill + '_max_rolls'] : sequence.length ? sequence : 0
                }
                console.log(attrSet);
                setAttrs(attrSet);
            });
        });
    }
})();