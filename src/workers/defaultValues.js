import {fields as card} from '../model/card';
import {fields as char} from '../model/character';


const defaultZero = (function(card, char){
    let result = [];

    for(let i = 1; i <= char.slots.inventoryslots.max; i++){
        result.push(`${char.slots.inventoryslots.prefix}_${i}`);
    }

    for(let i = 1; i <= char.slots.weaponslots.max; i++){
        result.push(`${char.slots.weaponslots.prefix}_${i}`);
    }
    

})(card);

const defaultOn = (function(card, char){
    let result = [];

})(card, char)


on('sheet:opened', function(){
    const default


});