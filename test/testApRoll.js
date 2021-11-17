import { RollAP } from "../src/scripts/rollAP";
import { fields as character } from '../src/model/character';
import { strict as assert } from 'assert';




describe('Ap Roll', function(){

    describe('Param Setup', function(){

        it('Default Params', function(){
            let expected = RollAP.defaultParams();
            expected.modifier = 0;
            expected.difficulty = 0;
            expected.multiply = [];
            expected.resource = [{label:'AP', field:'ap'}]


            assert.deepEqual(RollAP.setupParams({}), expected);
        });

        it('Overrides Params', function(){
            let expected = RollAP.defaultParams();
            expected.dice = 4,
            expected.pool = 5,
            expected.modifier = 0;
            expected.difficulty = 0;
            expected.multiply = [];
            expected.resource = [{label:'Test', field:'test'}]

            assert.deepEqual(RollAP.setupParams({dice: 4, pool: 5, resource:'test:Test'}), expected);
        });

        it('parseMultiArgs', function(){
            let test1 = 'regulararg';
            let test2 = 'test:Test|test2:Test2| test3:Test3 | test4 |';
            let test3 = '';
            let test4 = 4;

            assert.deepEqual(RollAP.parseMultiArg(test1), ['regulararg']);
            assert.deepEqual(RollAP.parseMultiArg(test2), ['test:Test', 'test2:Test2', 'test3:Test3', 'test4']);
            assert.deepEqual(RollAP.parseMultiArg(test3), []);
            assert.deepEqual(RollAP.parseMultiArg(test4), ['4']);
        })

        it('parsesResource', function(){
            let test1 = RollAP.parseMultiArg('test:Test|test2:Test2| test3:Test3 | test4 |');
            let test2 = RollAP.parseMultiArg('  test  ');

            assert.deepEqual(RollAP.parseFieldLabel(test1), [
                {label: 'Test', field: 'test'},
                {label: 'Test2', field: 'test2'},
                {label: 'Test3', field: 'test3'},
                {label: 'test4', field: 'test4'}
            ])

            assert.deepEqual(RollAP.parseFieldLabel(test2), [
                {label: 'test', field: 'test'}
            ])

            assert.deepEqual(RollAP.parseFieldLabel(['']), []);
            assert.deepEqual(RollAP.parseFieldLabel([]), []);
            assert.deepEqual(RollAP.parseFieldLabel(['test']), [{label:'test', field:'test'}]);

            assert.deepEqual(RollAP.parseFieldLabel(['test'], 'newlabel'), [{label:'newlabel', field:'test'}]);
            assert.deepEqual(RollAP.parseFieldLabel(['test:testlabel'], 'newlabel'), [{label:'testlabel', field:'test'}]);
        });

        it('generatesRollTexts', function(){
            assert.equal(RollAP.generateRollText(5, 10, 3), '{5d10}<3');
            assert.equal(RollAP.generateRollText(10, 5, 2), '{10d5}<2');
            assert.equal(RollAP.generateRollText(5, 10, 3, 2), '{5d10-2}<3');
            assert.equal(RollAP.generateRollText(5, 10, 4, -2), '{5d10--2}<4');
            assert.equal(RollAP.generateRollText(5, 10, 4, 10), '{5d10-10}<4');
            assert.equal(RollAP.generateRollText(5, 10, 4, 0, 2), '{5d8}<4');
            assert.equal(RollAP.generateRollText(5, 10, 3, 0, -2), '{5d12}<3');
        });
    });
})