import { Deck } from "../src/scripts/deck";
import { strict as assert } from 'assert';

describe ('Deck Class', function(){
    
    it('Inserts Cards on top', function(){
        let deck = new Deck();
        deck.addCard('card1', false);
        deck.addCard('card2', false);
        deck.addCard('card3', false);

        assert.deepEqual(deck.getDeck(), ['card1', 'card2', 'card3']);
        
    });

    it('Inserts Cards at Random', function(){
        let deck = new Deck();
        deck.addCard('card1');
        deck.addCard('card2');
        deck.addCard('card3');
        deck.addCard('card4');
        deck.addCard('card5');
        deck.addCard('card6');


        assert.ok(deck.getDeck().includes('card1'));
        assert.ok(deck.getDeck().includes('card2'));
        assert.ok(deck.getDeck().includes('card3'));
        assert.ok(deck.getDeck().includes('card4'));
        assert.ok(deck.getDeck().includes('card5'));
        assert.ok(deck.getDeck().includes('card6'));


        //its possible possible for this test to fail, so check it against the logs
        console.log(deck.getDeck());
        assert.notDeepEqual(deck.getDeck(),['card1', 'card2', 'card3', 'card4', 'card5', 'card6'] );
        
    });

    it('Draws Cards', function(){
        let deck = new Deck();
        deck.addCard('card1', false);
        deck.addCard('card2', false);
        deck.addCard('card3', false);

        assert.equal(deck.drawCard(), 'card3');
        assert.equal(deck.drawCard(), 'card2');

        assert.deepEqual(deck.getDeck(), ['card1']);
    });

    it('Removes Cards', function(){
        let deck = new Deck();
        deck.addCard('card1', false);
        deck.addCard('card2', false);
        deck.addCard('card3', false);

        deck.removeCard('card2');
        assert.deepEqual(deck.getDeck(), ['card1', 'card3']);

        deck.addCard('card1', false);
        deck.addCard('card2', false);

        deck.removeCard('card1');
        assert.deepEqual(deck.getDeck(), ['card1', 'card3', 'card2']);

        deck.removeCard('card1');
        assert.deepEqual(deck.getDeck(), ['card3', 'card2']);
    });


    it('Shuffles Deck', function(){
        let deck = new Deck();
        deck.addCard('card1', false);
        deck.addCard('card2', false);
        deck.addCard('card3', false);
        deck.addCard('card4', false);
        deck.addCard('card5', false);


        deck.shuffleDeck();

        console.log(deck.getDeck());
        assert.notDeepEqual(deck.getDeck(),['card1', 'card2', 'card3', 'card4', 'card5'] );
    });


})