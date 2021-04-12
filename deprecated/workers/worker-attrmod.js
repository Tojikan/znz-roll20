const attrData = [[{dataquery:'attrMods'}]];

for (let attr of attrData){
    on( 'change:' + attr, function(){
        getAttrs([attr], function(values) {
            var attrSet = {
                [attr + '_mod'] : (parseInt(values[attr], 10) - 3)
            }
            
            setAttrs(attrSet);
        });
    });
}