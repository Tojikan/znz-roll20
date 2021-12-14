import { strict as assert } from 'assert';
import  * as items from '../src/model/items.json';


describe('items', function(){

    let sum = 0;
    for (let k in items){
        if (items[k].quantity){
            sum += items[k].quantity || 0;
        }
    }

    console.log(sum);
})




