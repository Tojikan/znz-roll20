/////// Library of Functions for Interacting with Roll20 APIs


/**
 * Gets a player's selected character. Only returns the character if the player controls the Character or is a GM
 * 
 * @param {*} sender 
 * @param {*} msg 
 * @param {*} args 
 * @returns 
 */
 export function getCharacter(sender, msg, args = {}){
    let token,
        character = null;
    
    if ("selected" in msg){
        token = getObj('graphic', msg.selected[0]._id);

        if (token){
            character = getObj('character', token.get('represents'));
        }
    } else if ('characterid' in args){
        character = getObj('character', args['characterid']);
    }

    //Validate player controls token or is GM
    if (character){

        if (!playerIsGM(msg.playerid) && 
        !_.contains(character.get('controlledby').split(','), msg.playerid) &&
        !_.contains(character.get('controlledby').split(','),'all') && 
        msg.playerid !== 'API'){
            return null;
        }

    } else{
        return null;
    }

    return character;
}


/**
 * Retrieve an attribute for a given character
 * @param {*} character 
 * @param {*} attribute 
 * @returns The Attribute value
 */
 export const getAttr = function(character, attr){
    return findObjs({type: 'attribute', characterid: character.id, name: attr})[0];
}

/**
 * Get Attribute Value, and use default value if not present.
 * @param {*} character 
 * @param {*} attr 
 * @returns 
 */
export const getAttrVal = function(character, attr){
    return getAttrByName(character.id, attr);
}

/**
 * Set Attribute Value, and use default value if not present.
 * @param {*} character 
 * @param {*} attr
 * @param {*} value 
 * @returns 
 */
 export const setAttrVal = function(character, attr, value){
    let attribute = getAttr(character, attr);

    if (!attribute){
        return null;
    }
    
    let current = attribute.get('current');
    attribute.setWithWorker({current: value});


    return {
        initial: current,
        newValue: valued
    }
}


/**
 * Increase an attribute by 1 
 * @param {*} amount 
 * @param {*} resource 
 * @param {*} character 
 * @returns 
 */
 export function incrementCounter(character, attrId, amount=1){
    let attr = getAttr(character, attrId);

    if (!attr){
        return null;
    }

    let current = attr.get('current'),
        newValue = parseInt(current, 10) + 1;

    attr.setWithWorker({current: newValue});

    return {
        initial: current,
        newValue: newValue
    }
}

/**
 * Increase an attribute by 1 or -1
 * @param {*} amount 
 * @param {*} resource 
 * @param {*} character 
 * @returns 
 */
 export function unaryOperator(character, attrId, amount=1){
    let attr = getAttr(character, attrId);

    if (!attr){
        return null;
    }

    let current = attr.get('current'),
        newValue = parseInt(current, 10) + 1;

    attr.setWithWorker({current: newValue});

    return {
        initial: current,
        newValue: newValue
    }
}


export function addNumber(attr, amt){
    let current = attr.get('current'),
    newValue = parseInt(current, 10) + amt;
    attr.setWithWorker({current: newValue});

    return {
        initial: current,
        newValue: newValue
    }
}



/**
 * Post a formatted text to chat.
 * @param {*} msg 
 * @param {*} who 
 * @param {*} type 
 * @returns 
 */   
export function sendMessage (msg, who, type){
    let textColor = '#000',
        bgColor = '#fff';

    switch (type){
        case "error":
            textColor = '#C14054';
            bgColor = '#EBC8C4';
            break;
        case "info":
            bgColor = '#CCE8F4';
            textColor = '#456C8B';
            break;
        case "warning":
            bgColor = '#F8F3D6';
            textColor = '#8B702D';
            break;
        case "success":
            bgColor = '#baedc3';
            textColor = '#135314';
            break;
        case "header":
            sendChat(
                `${who}`,
                `<h3 style="border: solid 1px black; background-color: white; padding: 5px;">${msg}</h3>`
            );             
            return;
    }

    sendChat(
        `${who}`,
        `<div style="padding:3px; border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}; font-size: 120%;">${msg}</div>`
    );
}