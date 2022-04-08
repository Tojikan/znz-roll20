import { Deck } from '../src/scripts/deck';
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
        assert.deepEqual(deck.getDeck(), ['card3', 'card2']);

        deck.removeCard('card1');
        assert.deepEqual(deck.getDeck(), ['card3', 'card2']);
        
        deck.addCard('card3', false);
        deck.addCard('card3', false);
        deck.addCard('card3', false);
        deck.addCard('card3', false);
        deck.removeCard('card3');
        assert.deepEqual(deck.getDeck(), ['card2']);
    });


    it('Shuffles Deck', function(){
        let deck = new Deck();
        deck.addCard('card1', false);
        deck.addCard('card2', false);
        deck.addCard('card3', false);
        deck.addCard('card4', false);
        deck.addCard('card5', false);


        deck.shuffleDeck();

        assert.notDeepEqual(deck.getDeck(),['card1', 'card2', 'card3', 'card4', 'card5'] );
    });


    it('Sets Deck', function(){
        let deck = new Deck();
        deck.addCard('card1', false);
        deck.addCard('card2', false);
        deck.addCard('card3', false);

        deck.setDeck(['card4','card4','card4','card4']);
        assert.deepEqual(deck.getDeck(), ['card4','card4','card4','card4']);
    });

    it('Adds with object', function(){
        let deck = new Deck();
        deck.addCard({card:'card1', count: 4}, false);
        assert.deepEqual(deck.getDeck(), ['card1','card1','card1','card1']);


        deck.setDeck([
            'card1',
            'card2',
            {card:'card3', count: 3}
        ]);

        assert.deepEqual(deck.getDeck(), ['card1','card2','card3','card3','card3']);
    });


    it('Works with array card (draws random)', function(){
        let deck = new Deck();
        deck.addCard(['card1','card2','card3'], false);
        assert.deepEqual(deck.getDeck(), [['card1','card2','card3']]);

        let draw = deck.drawCard();
        assert.ok(draw == 'card1' || draw == 'card2' || draw == 'card3');
        
        //try again
        deck.addCard(['card1','card2','card3'], false);
        draw = deck.drawCard();
        assert.ok(draw == 'card1' || draw == 'card2' || draw == 'card3');

        deck.addCard({card:['card1','card2','card3'], count: 10}, false);


        while (deck.getLength() > 0){
            let d = deck.drawCard();
            console.log(d);
            assert.ok(d == 'card1' || d == 'card2' || d == 'card3');
        }
    });
})