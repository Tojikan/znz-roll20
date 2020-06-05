const stats = [
    "intelligence",
    "strength", 
    "dexterity",
    "empathy",
    "awareness",
    "tenacity",
    "health"
    ];


const setTotalAttrs = () => {
    getAttrs(stats, values => {
        let val = Object.values(values);

        let total = 0

        for (field in val){

            let count = parseInt(val[field], 10);
            total += count;
        }

        console.log("Total Attributes: " + total);

        setAttrs({
            ['total_attr_points']: total
        })


    });
}



stats.forEach(function (stat) {
    on("change:" + stat, function() {
        getAttrs([stat], function (values) {
            const score = parseInt(values[stat], 10) || 0;
            const mod = score - 3;

            mod > 0 ? setAttrs({ [stat + '_bonus']: "+" + mod }) : setAttrs({ [stat + '_bonus']: mod });
            
            setTotalAttrs();

            if (stat == "health"){
                const energy = score * 10;
                const health = score * 5;
                setAttrs({
                    ['hp_max'] : health,
                    ['energy_max'] : energy

                });
            }

            if (stat == 'tenacity'){
                const sanity = score * 5;

                setAttrs({
                    ['sanity_max']:sanity   
                });
            }

        });
    });
});

