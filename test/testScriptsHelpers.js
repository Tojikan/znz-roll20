import { strict as assert } from 'assert';
import { splitArgs } from '../src/scripts/_helpers';


describe('splitArgs', function(){

    it('Splits along = ', function(){
        let result = splitArgs("!!test test1=123 abc=321 hello=world tryit=okay");

        console.log(result);

        assert.ok('!!test' in result);
        assert.ok(result['!!test'] == 0);


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
        let result = splitArgs('!!test test1="123 123" test2=\'single quotes\' test3="abc123" test4=regular');

        console.log(result);

        assert.ok('!!test' in result);
        assert.ok(result['!!test'] == 0);

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
        let result = splitArgs('!!flags test1 --test2 --test3 test4 test5=regular');

        console.log(result);

        assert.ok('!!flags' in result);
        assert.ok(result['!!flags'] == 0);

        assert.ok('test1' in result);
        assert.ok(result['test1'] == 1);

        assert.ok('test2' in result);
        assert.ok(result['test2'] == true);

        assert.ok('test3' in result);
        assert.ok(result['test3'] == true);

        assert.ok('test4' in result);
        assert.ok(result['test4'] == 4);

        assert.ok('test5' in result);
        assert.ok(result['test5'] == 'regular');
    })

    it('nested quotes', function(){
        let result = splitArgs('!!test test1="\'123 123\'" test2=\'"single quotes"\' test4="regular"');

        console.log(result);

        assert.ok('!!test' in result);
        assert.ok(result['!!test'] == 0);

        assert.ok('test1' in result);
        assert.ok(result['test1'] == "'123 123'");

        assert.ok('test2' in result);
        assert.ok(result['test2'] == '"single quotes"');

        assert.ok('test4' in result);
        assert.ok(result['test4'] == 'regular');

        assert.ok(!('test5' in result));
    });
});
