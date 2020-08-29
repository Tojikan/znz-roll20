var assert = require('assert'),
    dq = require('../data-query');




describe('Parses a DataQuery for a query function', function(){
    it('Finds a Query Function', function(){
        var aThing =  ((({ valueSearch: "meleehitroll" })));

        assert.ok(dq.handleDataQuery(aThing) !== '');
    });

    it('Returns empty string if Not a Valid Query Function', function(){
        var notAThing =  ((({ notAFunction: "meleehitroll", src: "test" })));

        assert.ok(dq.handleDataQuery(notAThing) == '');
    });


});


describe('Performs a valueSearch', function(){
    it('Basic Value Search', function(){
        var lookup1 = ((({ valueSearch: "meleehitroll" })));
        var lookup2 = ((({ valueSearch: "attrib_count" })));
        var lookup3 = ((({ valueSearch: "humanity" })));
        var lookup4 = ((({ valueSearch: "Blunt Weapon 1" })));
        var lookup5 = ((({ valueSearch: "Shouldn't exist" })));
        var lookup6 = ((({ valueSearch: "" })));

        var result1 = dq.handleDataQuery(lookup1);
        var result2 = dq.handleDataQuery(lookup2);
        var result3 = dq.handleDataQuery(lookup3);
        var result4 = dq.handleDataQuery(lookup4);
        var result5 = dq.handleDataQuery(lookup5);
        var result6 = dq.handleDataQuery(lookup6);

        const fields = require('../data/fields.json');
        const weapons = require('../data/items-weapon.json');

        var expected1 = fields.hitroll.melee;
        var expected2 = fields.counters[0];
        var expected3 = fields.attributes.find(element => element.attr_name == 'humanity');
        var expected4 = weapons.blunt1;

        assert.equal(JSON.stringify(result1), JSON.stringify(expected1));
        assert.equal(JSON.stringify(result2), JSON.stringify(expected2));
        assert.equal(JSON.stringify(result3), JSON.stringify(expected3));
        assert.equal(JSON.stringify(result4), JSON.stringify(expected4));
        assert.equal(result5, '');
        assert.equal(result6, '');
    });

    it('Search in Specified Source', function(){
        var lookup1 = ((({ valueSearch: "meleehitroll", src:'fields' })));
        var lookup2 = ((({ valueSearch: "attrib_count", src:'items-armor' })));
        var lookup3 = ((({ valueSearch: "humanity", src:'items-misc' })));
        var lookup4 = ((({ valueSearch: "Blunt Weapon 1", src:'nonexistentsource' })));
        var lookup5 = ((({ valueSearch: "Shouldn't exist" })));
        var lookup6 = ((({ valueSearch: "" })));

        var result1 = dq.handleDataQuery(lookup1);
        var result2 = dq.handleDataQuery(lookup2);
        var result3 = dq.handleDataQuery(lookup3);
        var result4 = dq.handleDataQuery(lookup4);
        var result5 = dq.handleDataQuery(lookup5);
        var result6 = dq.handleDataQuery(lookup6);

        const fields = require('../data/fields.json');

        var expected1 = fields.hitroll.melee;

        assert.equal(JSON.stringify(result1), JSON.stringify(expected1));
        assert.equal(result2, '');
        assert.equal(result3, '');
        assert.equal(result4, '');
        assert.equal(result5, '');
        assert.equal(result6, '');
    });

    it('Searches for a specific property', function(){
        var lookup1 = ((({ valueSearch: "meleehitroll", prop:'canonical' })));
        var lookup2 = ((({ valueSearch: "attrib_count", prop:'attr_name' })));
        var lookup3 = ((({ valueSearch: "humanity", prop:'notaprop' })));
        var lookup4 = ((({ valueSearch: "Blunt Weapon 1", prop:'item_type' })));
        var lookup5 = ((({ valueSearch: "Shouldn't exist", prop: '' })));
        var lookup6 = ((({ valueSearch: "", prop: '' })));

        var result1 = dq.handleDataQuery(lookup1);
        var result2 = dq.handleDataQuery(lookup2);
        var result3 = dq.handleDataQuery(lookup3);
        var result4 = dq.handleDataQuery(lookup4);
        var result5 = dq.handleDataQuery(lookup5);
        var result6 = dq.handleDataQuery(lookup6);

        const fields = require('../data/fields.json');
        const weapons = require('../data/items-weapon.json');

        var expected1 = fields.hitroll.melee;
        var expected2 = fields.counters[0];

        assert.equal(JSON.stringify(result1), JSON.stringify(expected1));
        assert.equal(JSON.stringify(result2), JSON.stringify(expected2));
        assert.equal(result3, '');
        assert.equal(result4, '');
        assert.equal(result5, '');
        assert.equal(result6, '');
    });

    it('Returns a specific property', function(){
        var lookup1 = ((({ valueSearch: "meleehitroll", retprop:'attr_name' })));
        var lookup2 = ((({ valueSearch: "attrib_count", retprop:'display_name' })));
        var lookup3 = ((({ valueSearch: "humanity", retprop:'notaprop' })));
        var lookup4 = ((({ valueSearch: "Blunt Weapon 1", retprop:'notaprop2' })));
        var lookup5 = ((({ valueSearch: "Shouldn't exist", prop: '' })));
        var lookup6 = ((({ valueSearch: "", prop: '' })));

        var result1 = dq.handleDataQuery(lookup1);
        var result2 = dq.handleDataQuery(lookup2);
        var result3 = dq.handleDataQuery(lookup3);
        var result4 = dq.handleDataQuery(lookup4);
        var result5 = dq.handleDataQuery(lookup5);
        var result6 = dq.handleDataQuery(lookup6);

        const fields = require('../data/fields.json');
        const weapons = require('../data/items-weapon.json');

        var expected1 = fields.hitroll.melee.attr_name;
        var expected2 = fields.counters[0].display_name;
        var expected3 = fields.attributes.find(element => element.attr_name == 'humanity');
        var expected4 = weapons.blunt1;

        assert.equal(result1, expected1);
        assert.equal(result2, expected2);
        assert.equal(JSON.stringify(result3), JSON.stringify(expected3));
        assert.equal(JSON.stringify(result4), JSON.stringify(expected4));
        assert.equal(result5, '');
        assert.equal(result6, '');
    });
});

describe('Performs a propLookup', function(){

    it('Finds a property in all fields', function(){
        var test1 = ((({ propLookup: "eq_head" })));
        var test2 = ((({ propLookup: "eq_body" })));
        var test3 = ((({ propLookup: "stats.2.attr_name" })));
        var test4 = ((({ propLookup: "stats.3.display_name" })));
        var test5 = ((({ propLookup: "hitroll.ranged.canonical" })));
        var test6 = ((({ propLookup: "inventory.weight.readonly" })));
        var test7 = ((({ propLookup: "notapropokay" })));
        var test8 = ((({ propLookup: "inventory.weight.notaprop" })));

        var result1 = dq.handleDataQuery(test1);
        var result2 = dq.handleDataQuery(test2);
        var result3 = dq.handleDataQuery(test3);
        var result4 = dq.handleDataQuery(test4);
        var result5 = dq.handleDataQuery(test5);
        var result6 = dq.handleDataQuery(test6);
        var result7 = dq.handleDataQuery(test7);
        var result8 = dq.handleDataQuery(test8);

        const fields = require('../data/fields.json');
        const prefix = require('../data/prefixes.json');
        
        var expected1 = prefix.eq_head;
        var expected2 = prefix.eq_body;
        var expected3 = fields.stats[2].attr_name;
        var expected4 = fields.stats[3].display_name;
        var expected5 = fields.hitroll.ranged.canonical;
        var expected6 = fields.inventory.weight.readonly;

        assert.equal(JSON.stringify(result1), JSON.stringify(expected1));
        assert.equal(JSON.stringify(result2), JSON.stringify(expected2));
        assert.equal(JSON.stringify(result3), JSON.stringify(expected3));
        assert.equal(JSON.stringify(result4), JSON.stringify(expected4));
        assert.equal(JSON.stringify(result5), JSON.stringify(expected5));
        assert.equal(JSON.stringify(result6), JSON.stringify(expected6));
        assert.equal(result7, '');
        assert.equal(result8, '');

    })

});