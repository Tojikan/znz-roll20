import { getCharacter } from "./_playerConnector";


class PlayerCharacter{

    constructor(sender, msg, args = {}) {
        this.character = getCharacter(sender, msg, args);
    }


    


    
}