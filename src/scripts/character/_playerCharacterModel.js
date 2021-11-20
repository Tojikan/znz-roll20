import { getAttrVal, getAttr, addNumber } from "./_playerConnector";
import { capitalize } from "lodash";



export class PlayerCharacterModel  {
    constructor(character, includeGetters = true){
        this.character = character;
        this.includeGetters = includeGetters;
    }
    
    NumberField(id, label){
        return {
            id: id,
            label: label || capitalize(id),
            attr: () => getAttr(this.character, id), 
            val: () => getAttrVal(this.character, id),
            increment: () => addNumber(getAttr(this.character, id), 1),
            decrement: () => addNumber(getAttr(this.character, id), -1),
        }
    }



    get life(){ return this.NumberField('life') };
    get ap(){ return this.NumberField('ap', 'AP')};


    export(){
        return {
            stats: {
                life: this.life.id,
                ap: this.ap.id
            }
        }
    }

}


export const playerCharacterModel = {
        life: {
    },




    attr: {
        life: {
            id: 'life',
            get: function(){
                getVal

            }
        },
        ap: {
            id: 'ap',
            label: 'AP'
        },
        exh: {
            id: 'exh',
            label: 'Exhaustion'
        }
    }
}
