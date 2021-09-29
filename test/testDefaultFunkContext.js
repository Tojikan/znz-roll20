var assert = require('assert');
var FunkContext = require("../FunkContext");
var defaultContext = require('../default_funkContext');



describe('Default Funkcontext', function(){
    var testDefault = new FunkContext('./test/testdata', defaultContext.defaultFuncs, defaultContext.reusables); // path must be relative to location of funkcontext file

    describe('Provided funcs function', function(){
        it('RunFunction works', function(){
            assert.deepEqual(testDefault.funcs.data, testDefault.funcs.runFunction((d) => { return d } ));
            
            assert.equal(testDefault.funcs.data.test2.nested.nested.nested, testDefault.funcs.runFunction((x)=>{
                return x.test2.nested.nested.nested;
            }));

            assert.equal("foo", testDefault.funcs.runFunction((x)=>{
                return x.test.bar;
            }));
            
            assert.throws(function(){testDefault.funcs.runFunction('hello')});

            assert.deepEqual(testDefault.funcs.data.test, JSON.parse(testDefault.doFunk('', 'runFunction((x)=>{ return x["test"]})')));
        });

        it('transformData works', function(){
            var test = require('./testdata/test.json');
            test.foo = test.foo + test.foo;
            
            assert.deepEqual(test.foo, testDefault.funcs.transformData('test.foo', (x) => { return x + x;}));

            test.foobar = test.foobar.push('123');

            assert.deepEqual(test.foobar, testDefault.funcs.transformData('test.foobar', (x) => { return x.push('123');}));

            var test2 = require('./testdata/test2.json');
            test2.nested.nested.nested = 1;

            assert.deepEqual(test2.nested.nested.nested, testDefault.funcs.transformData('test2.nested.nested.nested', (x) => { return 1;}));


            assert.deepEqual(test2.nested.nested.nested, testDefault.doFunk('', 'transformData("test2.nested.nested.nested", (x)=>{return 1;});') );

        });

        it('searches for Properties', function(){
            var searchtest = require('./testdata/searchtest.json');

            assert.deepEqual(searchtest.attr1[4][2], testDefault.funcs.searchProperty('power', 'ice'));
            assert.deepEqual(searchtest.attr2.value, testDefault.funcs.searchProperty('term', 'attr2value'));
            assert.deepEqual({"value": "hideme!"}, testDefault.funcs.searchProperty('value', 'hideme!'));

            assert.deepEqual(searchtest.fields.powers.fight, JSON.parse(testDefault.doFunk('','searchProperty("canon", "fight")')));

            assert.equal("", testDefault.doFunk('','searchProperty("canon", "fight", "test")'));
            assert.equal("", testDefault.doFunk('','searchProperty("canon", "flight", "test2")'));
            assert.deepEqual(searchtest.fields.powers.flight, JSON.parse(testDefault.doFunk('','searchProperty("canon", "flight", "searchtest")')));

        });
    });
});
