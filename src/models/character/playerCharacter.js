import { CharacterModel } from "./CharacterModel";
import { exportFields } from "./_model";
import { getCharacter, getAttrVal, setAttrVal } from "./_r20lib";


class PlayerCharacter{

    constructor(sender, msg, args = {}) {
        this.character = getCharacter(sender, msg, args);

        this.model = CharacterModel;
        this.data = {};

        // Setup Getters and Setters for every property in our model.
        for (let attr of Object.keys(this.model)){
            // Dynamic Get/Set functionality.

            //TODO - get this to work
            this.data[attr] = {
                get: {

                },
                set: {

                }
            };
        }
    }

    getAttrVal = getAttrVal;


    


    
}