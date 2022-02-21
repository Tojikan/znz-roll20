export class Deck {
    constructor(arr=[]){
        this.deck = arr;
    }
    
    addCard(card, random=true){
        
        // If a card is an object. You can give it a count property to add multiple cards.
        // in that case, it'll need a card property which is the value of the card.
        let count = card.hasOwnProperty('count') ? card.count : 1,
            cardVal = card.hasOwnProperty('card') ? card.card : card;

        //Only allow strings?
        //TODO - if other types may be needed, evaluate
        if (typeof cardVal !== 'string'){
            return;
        }

        
        //use loop so we can add duplicates of a card.
        for (let i = 0; i < count; i++){
            if (random){
                let i = Math.floor(Math.random() * this.deck.length);
                this.deck.splice(i, 0, cardVal);
            } else {
                this.deck.push(cardVal);
            }
        }
    }

    drawCard(){
        return this.deck.pop();
    }

    removeCard(card){
        for (let i = this.deck.length - 1; i >= 0; i--){
            if (this.deck[i] == card){
                this.deck.splice(i, 1);
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

    setDeck(deck){
        this.clearDeck();
        for (let card of deck){
            this.addCard(card, false);
        }
        this.shuffleDeck();
    }

    clearDeck(){
        this.deck = [];
    }

    getDeck(){
        return this.deck;
    }

    getLength(){
        return this.deck.length;
    }
}


