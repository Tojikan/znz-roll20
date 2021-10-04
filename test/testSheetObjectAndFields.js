var assert = require('assert');
var Field = require("../src/data/_field");
var FieldGroup = require('../src/data/_fieldGroup');
var SheetObject = require('../src/data/_sheetObject');
var card = require('../src/data/card');
var char = require('../src/data/character');

console.log(char);
// console.log(card);


describe('ToJson()', function(){
    var json1 = {
        id: "name",
        label: "Name",
        type: "whatever",
        test: "something"
    };
    var field1 = new Field("name", {type:"whatever", test:"something"});

    var json2 = {
        id: "attack",
        label: "Whatever I want",
        type: "whatever",
        test: "something"
    };
    var field2 = new Field("attack", {type:"whatever", test:"something"}, 'Whatever I want');


    var fgjson1 = {
        name: field1.toJson(),
        attack: field2.toJson()
    };
    var fg1 = new FieldGroup("group", [field1, field2]);

    var so1json = {
        name: field1.toJson(),
        attack: field2.toJson(),
        group: fg1.toJson(),
        arr: [],
        str: "123",
        obj: {}
    }
    var so = new SheetObject([field1, field2, fg1, {arr:[]}, {str:"123"}, {obj: {}}]);


    it('Outputs proper Json of a field', function(){
        // console.log(field1.toJson());
        assert.deepEqual(json1, field1.toJson());
    });

    it('Adds custom labels', function(){
        // console.log(field2.toJson());
        assert.deepEqual(json2, field2.toJson());
    })

    it('FieldsGroups outputs Json', function(){
        // console.log(fg1.toJson());
        assert.deepEqual(fgjson1, fg1.toJson());
    });


    it('SheetObject getFields', function(){
        // console.log(sg1.toJson());
        assert.deepEqual(so1json, so.getFields());
    });
});