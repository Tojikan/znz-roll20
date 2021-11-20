import { exportFields } from "../src/character/_model";
import { strict as assert } from 'assert';

describe('exportFields', function(){
    const stdTest = {
        field1:{},
        field2:{id:'fieldid'},
        field3:{ label: 'NewLabel'},
        field4:{id:'newid', label: 'TestLabel'}
    };

    const expected = {
        field1:{id:'field1', label:'Field1'},
        field2:{id:'fieldid', label:'Field2'},
        field3:{id:'field3', label:'NewLabel'},
        field4:{id:'newid', label:'TestLabel'}
    };

    it('exportsTopLevelFields', function(){
        let result = exportFields(stdTest);
        assert.deepEqual(expected , result);
    });
    
    it('exportsLists', function(){

        let withlists = {...stdTest};
        let expectedWithlists = {...expected};

        let prefixed = {};

        for (let k of Object.keys(expected)){
            prefixed[k] = {...expected[k]};
            prefixed[k].id = 'fieldlists_' + expected[k].id;
        }

        //copy into lists
        withlists.fieldlists = { list: {...stdTest}};
        expectedWithlists.fieldlists = { list: {...prefixed}};

        let result = exportFields(withlists);

        // console.log(result.fieldlists);
        //  console.log(expectedWithlists.fieldlists);

        assert.deepEqual(expectedWithlists , result);
    });

    it('exportsProps', function(){
        let props = {...stdTest};
        let expectedProps = {...expected};
        expectedProps.field1.prop = props.field1.prop = 'test';
        expectedProps.field2.prop = props.field2.prop = 'test2';
        expectedProps.field3.prop = props.field3.prop = {prop:'test3'};
        expectedProps.field4.prop = props.field4.prop = ['test4','test4'];

        let result = exportFields(props);

        assert.deepEqual(expectedProps , result);

    });


})