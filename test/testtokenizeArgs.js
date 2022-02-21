import { strict as assert } from 'assert';
import { tokenizeArgs } from '../src/lib/znzlib';


describe('tokenizeArgs', function(){

    it('Splits along = ', function(){
        let result = tokenizeArgs("!!test test1=123 abc=321 hello=world tryit=okay");
        assert.ok('0' in result);
        assert.ok(result[0] = '!!test');

        assert.ok('test1' in result);
        assert.ok(result.test1 == '123');

        assert.ok('abc' in result);
        assert.ok(result.abc == '321');

        assert.ok('hello' in result);
        assert.ok(result.hello == 'world');

        assert.ok('tryit' in result);
        assert.ok(result.tryit == 'okay');
    });

    it('Includes everything in quotes', function(){
        let result = tokenizeArgs('!!test test1="123 123" test2=\'single quotes\' test3="abc123" test4=regular');

        assert.ok('0' in result);
        assert.ok(result[0] = '!!test');

        assert.ok('test1' in result);
        assert.ok(result['test1'] == '123 123');

        assert.ok('test2' in result);
        assert.ok(result['test2'] == 'single quotes');

        assert.ok('test3' in result);
        assert.ok(result['test3'] == 'abc123');

        assert.ok('test4' in result);
        assert.ok(result['test4'] == 'regular');

        assert.ok(!('test5' in result));
    });

    it('handles flags', function(){
        let result = tokenizeArgs('!!flags test1 --test2 --test3 test4 test5=regular');
        assert.ok(result[0] = '!!flags');

        assert.ok('1' in result);
        assert.ok(result[1] = 'test1');

        assert.ok('test2' in result);
        assert.ok(result['test2'] == true);

        assert.ok('test3' in result);
        assert.ok(result['test3'] == true);

        assert.ok(!('test4' in result));

        assert.ok('test5' in result);
        assert.ok(result['test5'] == 'regular');
    })

    it('nested quotes', function(){
        let result = tokenizeArgs('!!test test1="\'123 123\'" test2=\'"single quotes"\' test4="regular"');

        assert.ok(result[0] = '!!test');

        assert.ok('test1' in result);
        assert.ok(result['test1'] == "'123 123'");

        assert.ok('test2' in result);
        assert.ok(result['test2'] == '"single quotes"');

        assert.ok('test4' in result);
        assert.ok(result['test4'] == 'regular');

        assert.ok(!('test5' in result));
    });

    it('backtick', function(){
        let result = tokenizeArgs('!!test test1=`test1` test2=`"test2"` test3=`\'test3\'` test4=`"\'test4\'"` ');
        assert.ok(result['test1'] == 'test1')
        assert.ok(result['test2'] == '"test2"');
        assert.ok(result['test3'] == "'test3'");
        assert.ok(result['test4'] == `"'test4'"`);


        result = tokenizeArgs('!!test spaces=`test with spaces` nestedspaces=`"test with " nested spaces`');
        assert.ok(result['spaces'] == 'test with spaces');
        assert.ok(result['nestedspaces'] == '"test with " nested spaces');


    });
    
    it('json', function(){
        let json = tokenizeArgs('json=`["test1","test2","test3"]`');
        assert.ok(json.json == '["test1","test2","test3"]');


        json = tokenizeArgs('json=`["food","item=\'food\' rarity=\'epic\'","item=\'food\' rarity=\'rare\'",{"count":5,"card":"food"}]`');
        assert.ok(json.json == `["food","item='food' rarity='epic'","item='food' rarity='rare'",{"count":5,"card":"food"}]`);
    })
});
