

import * as items from '../model/items.json';

export class Deck {
    constructor(arr=[]){
        this.deck = arr;
    }

    addCard(card, random=true){

        if (random){
            let i = Math.floor(Math.random() * this.deck.length);
            this.deck.splice(i, 0, card);
        } else {
            this.deck.push(card);
        }
    }

    drawCard(){
        return this.deck.pop();
    }

    removeCard(card){
        for (let i = this.deck.length - 1; i >= 0; i--){
            if (this.deck[i] == card){
                this.deck.splice(i, 1);
                return;
            }
        }
    }

    shuffleDeck(){
        for (let i = this.deck.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.deck[i];

            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
    }

    clearDeck(){
        this.deck = [];
    }

    getDeck(){
        return this.deck;
    }
}


export const cardDeck = (function(){
    const deck = new Deck();

    const setupDeck = function(){
        deck.clearDeck();

        for (let key in items){
            let item = items[key],
                count = item.quantity || 1;

            if(key == 'default'){ //somehow, we're importing a default value.
                continue;
            }

            for (let i = 0; i < count; i++){
                deck.addCard(key);
            }
        }

        deck.shuffleDeck();
    }


    const handleArgs = function(args, character){
        let retVal = {};

        if ("reset" in args && args['reset']==true){
            setupDeck();
            log('Deck Reset!');
            log(deck.getDeck());
        }

        if ("shuffle" in args && args['shuffle']==true){
            log('Deck Shuffled!');
            deck.shuffleDeck();
            log(deck.getDeck());
        }

        if ("draw" in args){
            log('Card Drawn!');
            let card = deck.drawCard();
            log(card);
            log(deck.getDeck());


            if (!card){ 
                retVal.error = "Deck has no more cards!";
            } else {
                retVal.card = card;
            }

        }

        if ("add" in args && args['add'].length){
            log('Card Added!');
            deck.addCard(args['add']);
            log(deck.getDeck());
        }

        if ("remove" in args && args['remove'].length){
            log('Card Removed!');
            deck.removeCard(args['remove']);
            log(deck.getDeck());
        }

        if ("info" in args){
            retVal.info = `Deck has ${deck.getDeck().length} cards remaining!`;
        }
        
        return retVal;
    }
    
    const handleResponse = function(response, sender, character){
        
        if (response){
            let msg = '';
            if ('info' in response){
                sendChat(sender, `/w gm ${response.info}`);
            }
            
            if ('error' in response || 'card' in response ){
                msg += `&{template:default} {{name=${character.get('name')} attempts to scavenge for an item!}} `;
            }

            if ('error' in response){
                msg += `{{Error= <span style="color:red">${response.error}</span>`;
            }
            
            if ('card' in response){
                let itemkey = response.card;

                if (itemkey in items){
                    let item = items[itemkey];

                    log(item);
                    log(itemkey);

                    msg += ` {{Result= ${character.get('name')} found a ${item.name}!}} `;

                    sendChat(sender, `!!pickup item='${itemkey}' characterid='${character.get('id')}'`);
                } else {
                    msg += `{{Result= ${character.get('name')} found a ${itemkey}. This is not a registered item!}}`;
                }
            }


            if (msg.length){
                sendChat(sender, msg);
            }
        }
    }

    
    setupDeck(); //Setup on initial upload of script.

    return {
        caller: '!!deck', 
        handler: handleArgs,
        responder: handleResponse,
        requires: ['character']
    };
})();