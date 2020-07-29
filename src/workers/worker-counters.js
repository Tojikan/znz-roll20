const counterData = [[{dataquery:'counts'}]];

for (let count of counterData){

    let changeStr = count.attr_list.join(' change:');
    
    changeStr = 'change:' + changeStr;

    
    on( changeStr, function(){
        getAttrs(count.attr_list, function(values) {
            let vals = Object.values(values).map( (x) => { return parseInt(x,10)}),
            valSum = vals.reduce((a,b) => a + b, 0);

            let attrSet = {};
            attrSet[count.attr_name] = valSum;
            
            setAttrs(attrSet);
        });
    })

}