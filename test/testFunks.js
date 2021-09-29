var assert = require('assert');
var FunkContext = require("../FunkContext");

describe('The FunkContext', function(){
    it("throws on fake or non directory", function(){
        assert.throws(function(){ return new FunkContext('./FakeDirectory', {})});
        assert.throws(function(){ return new FunkContext('123151NotDir', {})});
        assert.throws(function(){ return new FunkContext([], {})});
    })

    it("pulls in data from data folder", function(){
        var test = new FunkContext('./test/testdata'); //needs to be relative from root
        var test2 = new FunkContext('./test/testdata/'); //test with backslash included
        var testjson = require('./testdata/test.json'); //needs to be relative from here

        assert.deepEqual(test.funcs.data.test, testjson);
        assert.deepEqual(test2.funcs.data.test, testjson);

        testjson = require('./testdata/test2.json');

        assert.deepEqual(test.funcs.data.test2.nested.nested, testjson.nested.nested);
        assert.deepEqual(test2.funcs.data.test2.nested.nested, testjson.nested.nested);

        testjson = require('./testdata/file with space.json');
        assert.deepEqual(test.funcs.data['file with space'], testjson);
        assert.deepEqual(test2.funcs.data['file with space'], testjson);


    });

    it("adds in funcs", function(){
        var test = new FunkContext('./test/testdata', {
            func1: function(){},
            func2: function(){},
            func3: this.func2,
            var1: 'test',
            var2: []
        });
        
        assert.ok("func1" in test.funcs);
        assert.ok(typeof(test.funcs.func1) === 'function');

        assert.ok("func2" in test.funcs);
        assert.ok(typeof(test.funcs.func2) === 'function');

        assert.ok("func3" in test.funcs);
        assert.ok(typeof(test.funcs.func2) === 'function');

        assert.ok("var1" in test.funcs);
        assert.equal('test', test.funcs.var1);

        assert.ok("var2" in test.funcs);
        assert.deepEqual([], test.funcs.var2);
    });

    it("evals a func", function(){
        var thischeck = function(){
            return this.data;
        }


        var test = new FunkContext('./test/testdata', {
            func1: function(){ return "hello"},
            func2: function(name){return "hello " + name;},
            func3: thischeck
        }, {}, false);

        assert.equal(test.doFunk("", "func1()"), "hello");
        assert.equal(test.doFunk("", "func2('ian')"), "hello ian");
        assert.equal(test.doFunk("", "data.test.foo"), "bar");
        assert.equal(test.doFunk("", "data.test.bar"), "foo");

        var testjson = require('./testdata/test.json'); //needs to be relative from here

        assert.equal(test.doFunk("", "data.test.foobar"), JSON.stringify(testjson.foobar));
        assert.equal(test.doFunk("", "data.test"), JSON.stringify(testjson));

        assert.equal(test.doFunk("", "func3()"), JSON.stringify(test.funcs.data));
    });

    it("has reusables", function(){
        var test = new FunkContext('./test/testdata', {},
        {
            var1: 'aaa',
            func1: function(){ return "hello world"},
            func2: function(name){ return "hello " + name},
            var2: ['a', 'b', 'c']
        },
        false);

        assert.equal(test.doFunk("", "getReusable('var1')"), 'aaa');
        assert.equal(test.doFunk("", "getReusable('func1')"), (function(){ return "hello world"}).toString());
        assert.equal(test.doFunk("", "getReusable('func2')"), (function(name){ return "hello " + name}).toString());
        assert.equal(test.doFunk("", "getReusable('var2')"), ['a', 'b', 'c'].toString());
    });
});
