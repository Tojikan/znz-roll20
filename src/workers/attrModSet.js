(function() {
    const attrData = (([[
        transformData('attributes.json', (data) => {
            return data.map((x)=>{
                return x.attr_name;
            })
        })
    ]]));

    for (let attr of attrData){
        on( 'change:' + attr, function(){
            getAttrs([attr], function(values) {
                let numOfDice = Math.ceil((parseInt(values[attr], 10)) / 2);

                var attrSet = {
                    [attr + '_mod'] : (parseInt(values[attr], 10) - 3),
                    [attr + '_dice'] : numOfDice,
                    [attr + '_max_rolls'] : sequenceNumber(numOfDice, '|')
                }
                
                setAttrs(attrSet);
            });
        });
    }
})();