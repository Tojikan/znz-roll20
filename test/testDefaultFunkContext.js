var assert = require('assert');
var FunkContext = require("../FunkContext");
var defaultContext = require('../defaultContext');



describe('Default Funkcontext', function(){
    var testDefault = new FunkContext('./test/testdata', defaultContext.defaultFuncs, defaultContext.reusables); // path must be relative to location of funkcontext file

    describe('Provided funcs function', function(){
        it('RunFunction works', function(){
            assert.deepEqual(testDefault.context.data, testDefault.context.runFunction((d) => { return d } ));
            
            assert.equal(testDefault.context.data.test2.nested.nested.nested, testDefault.context.runFunction((x)=>{
                return x.test2.nested.nested.nested;
            }));

            assert.equal("foo", testDefault.context.runFunction((x)=>{
                return x.test.bar;
            }));
            
            assert.throws(function(){testDefault.context.runFunction('hello')});

            assert.deepEqual(testDefault.context.data.test, JSON.parse(testDefault.doFunk('', 'runFunction((x)=>{ return x["test"]})')));
        });

        it('transformData works', function(){
            var test = require('./testdata/test.json');
            test.foo = test.foo + test.foo;
            
            assert.deepEqual(test.foo, testDefault.context.transformData('test.foo', (x) => { return x + x;}));

            test.foobar = test.foobar.push('123');

            assert.deepEqual(test.foobar, testDefault.context.transformData('test.foobar', (x) => { return x.push('123');}));

            var test2 = require('./testdata/test2.json');
            test2.nested.nested.nested = 1;

            assert.deepEqual(test2.nested.nested.nested, testDefault.context.transformData('test2.nested.nested.nested', (x) => { return 1;}));


            assert.deepEqual(test2.nested.nested.nested, testDefault.doFunk('', 'transformData("test2.nested.nested.nested", (x)=>{return 1;});') );

        });

        it('searches for Properties', function(){
            var searchtest = require('./testdata/searchtest.json');

            assert.deepEqual(searchtest.attr1[4][2], testDefault.context.searchProperty('power', 'ice'));
            assert.deepEqual(searchtest.attr2.value, testDefault.context.searchProperty('term', 'attr2value'));
            assert.deepEqual({"value": "hideme!"}, testDefault.context.searchProperty('value', 'hideme!'));

            assert.deepEqual(searchtest.fields.powers.fight, JSON.parse(testDefault.doFunk('','searchProperty("canon", "fight")')));

            assert.equal("", testDefault.doFunk('','searchProperty("canon", "fight", "test")'));
            assert.equal("", testDefault.doFunk('','searchProperty("canon", "flight", "test2")'));
            assert.deepEqual(searchtest.fields.powers.flight, JSON.parse(testDefault.doFunk('','searchProperty("canon", "flight", "searchtest")')));

        });
    });
});
