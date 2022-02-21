import { Deck } from "./deck";
import { setupScriptVars } from "../lib/roll20lib";

export const LootDeck = function(){
    const deck = new Deck();

    const setup = setupScriptVars;

    const handleResponse = function(response, sender, character){
        
        if (response){
            let msg = '',
            pickup = '';

            if ('info' in response){
                msg += `&{template:default} {{name=Loot Deck Info}} `;
                msg += ` {{Info=${response.info}}}`;
            }

            else if ('error' in response){
                msg += `&{template:default} {{name=Error in Loot Deck!}} `;
                msg += ` {{Error=${response.error}}}`;
            }
            

            else if ('card' in response || 'fail' in response){
                msg += `&{template:default} {{name=${character.get('name')} attempts to scavenge for an item!}} `;

                if ('fail' in response){
                    msg += ` {{Result=${response.fail}}}`;
                } 

                if ('card' in response){    
                    pickup = response.card;

                }
            }  
            
            if (msg.length){
                sendChat(sender, msg);
            }
            
            //We can just let the pickup script handle the rest. We just have to make sure all decks are written in a way that will work with pickup.
            if (pickup.length){
                sendChat(sender, `!!pickup ${pickup} characterid='${character.get('id')}'`);
            }
        }
    }


    const handleDeck = function(msg){
        if (msg.type !== "api" || !msg.content.startsWith('!!deck')){
            return;
        }
        
        const {args, sender, character} = setup(msg),
        retVal = {};

        //make it easier to setup args.
        let shortArg = ('1' in args ? args['1'] : '');

        // Don't support multiple args, so uses a else if
        
        //Clear deck. Don't use shorthand here for safety.
        if ("clear" in args && args['clear'] == true){
            log('Loot Deck Reset!');
            deck.clearDeck();
            log(deck.getDeck());
        
        // Shuffle the deck
        } else if ("shuffle" in args || shortArg == 'shuffled'){
            log('Loot Deck Shuffled!');
            deck.shuffleDeck();
            log(deck.getDeck());
            retVal.info = "The Loot Deck was shuffled!";
        }

        // Draw a card.
        else if ("draw" in args || shortArg == 'draw'){
            let card = deck.drawCard();
            
            if (!card){ 
                log('Attempted to draw, but Loot Deck was empty');
                retVal.fail = "The Loot Deck is empty!";
            } else {
                log(`Attempted to draw a ${card} from the Loot Deck!`);
                retVal.card = card;
            }
        }

        //Set a deck from some json. this needs an arg.
        else if ("set" in args){
            try {
                log('Attempting to set deck with:');
                log(args['set']);
                let json = JSON.parse(args['set']);

                if (!Array.isArray(json)){
                    log('Invalid value when setting loot deck!');
                    retVal.error = "Invalid type when setting Loot Deck!";
                }

                deck.setDeck(json);
                deck.shuffleDeck();
                log("Set Loot Deck with " + deck.getLength() + ' cards!');
                log(deck.getDeck());
                retVal.info = "The Loot Deck was set with new cards!";
            } catch(e){
                log(e.message);
                retVal.error = "Unknown error setting loot deck!";
                log('Error');
            }
        }

        // Add a card to the deck
        else if ("add" in args && args['add'].length){
            let toAdd = args['add'];

            //In case we want to add json array, try to parse it first.
            try {
                let json = JSON.parse(toAdd);
                toAdd = json;
            } catch(e){}

            log(`Added card(s) '${args['add']}' to deck!`); // log raw text
            deck.addCard(toAdd);
        }

        // Remove a card from the deck
        else if ("remove" in args && args['remove'].length){
            log(`Removed card '${args['remove']}' from deck!`);
            deck.removeCard(args['remove']);
        }

        // Display deck length. Log deck to console.
        else if ("info" in args || shortArg == 'info'){
            log('Getting deck info!');
            retVal.info = `Deck has ${deck.getDeck().length} cards remaining!`;
            log(deck.getDeck());
            log(deck.getLength());
        }
        

        handleResponse(retVal, sender, character);
        return retVal;
    }
    
    return {
        handleDeck: handleDeck
    };
};