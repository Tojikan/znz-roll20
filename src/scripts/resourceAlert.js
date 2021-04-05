on("change:attribute", function(obj, prev){
    //Key is the attribute name, value is the display name.
    const attrData = (([[transformData('resource', (data) => {
        var result = {};

        for (attr of data){
            result[attr.attr_name] = attr.display_name;
        }

        return result;
    })]]));
    var attr;


    if (obj.get("name") in attrData){
        attr = attrData[obj.get("name")];
    } else {
        return;
    }


    let textColor = '#800080',
        bgColor = '#e6e6fa',
        prevVal = prev['current'], //prev is a basic object without getters/setters
        curVal = obj.get('current'),
        action,
        diff,
        character = getObj('character', obj.get('_characterid'));

    diff = Math.abs(curVal - prevVal);

    sendChat(
        'ZnZ Resource Change',
        `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}"><strong>${character.get('name')}'s ${attr} resource was changed!</strong><div> <div>Previous Value:  ${prevVal}</div><div> New Value: ${curVal} .</div></div>`
    );

    if (curVal <= 0){
        textColor = '#8B0000';
        bgColor = '#FFA07A';
        sendChat(
            'ZnZ Resource Spent',
            `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}"><strong>${character.get('name')} reached 0 ${attr} points!</strong></div>`
        );
    }

});