on("change:attribute", function(obj, prev){
    let attr;

    switch (obj.get("name")){
        case "energy":
            attr = "Energy";
        break;

        case "hp":
            attr = "Hit";

        break;

        case "sanity":
            attr = "sanity";
        break;

        case "exp":
            attr = "Exp";
        break;

        default:
            return;
    }

    let textColor = '#800080',
        bgColor = '#e6e6fa',
        prevVal = prev['current'], //prev is a basic object without getters/setters
        curVal = obj.get('current'),
        action,
        diff,
        character = getObj('character', obj.get('_characterid'));

    if (prevVal > curVal){
        action = ' subtracted ';
    } else if (curVal > prevVal){
        action = ' added ';
    } else {
        //If its not related to the current value, then we can ignore it. 
        return;
    }

    diff = Math.abs(curVal - prevVal);
    

    sendChat(
        'ZnZ Resource Spent',
        `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}"><strong>${character.get('name')} ${action} ${diff} ${attr} points!</strong><div> The new value is ${curVal} and the previous value was ${prevVal}.</div></div>`
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