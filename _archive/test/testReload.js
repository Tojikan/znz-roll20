import { strict as assert } from 'assert';
import { reload } from '../src/scripts/reload';


describe('calculateAmmo', function(){

    it('calculatesAmmo', function(){
        assert.equal(reload.calculateAmmo(3, 6, 10), 3);
        assert.equal(reload.calculateAmmo(0, 6, 10), 6);
        assert.equal(reload.calculateAmmo(0, 0, 10), 0);
        assert.equal(reload.calculateAmmo(0, -5, 10), 0);
        assert.equal(reload.calculateAmmo(2, -5, 10), 0);
        assert.equal(reload.calculateAmmo(2, 25, 0), 0);
        assert.equal(reload.calculateAmmo(2, 25, 2), 2);
    })
})