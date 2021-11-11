import { equip } from "../src/workers/equip";
import { fields as card } from '../src/model/card';
import { fields as character } from '../src/model/character';
import { strict as assert } from 'assert';

describe ('equip', function(){
    let equipped = equip();

    it('remapKeys', function(){
        let obj1 = {
            name: '',
            weight: '',
            quantity: ''
        };

        let obj1result = equipped.remapKeys(obj1, 'inventory_');
        let obj2result = equipped.remapKeys(obj1, '_1', false);

        assert.deepEqual(Object.keys(obj1result), ['inventory_name', 'inventory_weight', 'inventory_quantity']);
        assert.deepEqual(Object.keys(obj2result), ['name_1', 'weight_1', 'quantity_1']);

        let obj3result = equipped.remapKeys(obj1result, '_2', false, (x) => { return x.replace('inventory_', '');});
        assert.deepEqual(Object.keys(obj3result), ['name_2', 'weight_2', 'quantity_2']);
    });

    it ('findsAvailableSlots', function(){
        let noequipmentslot = {
            test_1: 0,
            weapon_2: 0,
            equipment_0: 0, //equipment is 1 indexed
            equipment_1: 1,
            equipment_2: 2,
            equipment_3: 0
        };

        let noempty = {
            equipmentslots: 5,
            test_1: 0,
            weapon_2: 0,
            equipment_0: 0, //equipment is 1 indexed
            equipment_1: 1,
            equipment_2: 1,
            equipment_3: 1,
            equipment_4: 1,
            equipment_5: 1,
        };

        let exceeds = {
            equipmentslots: 3,
            test_1: 0,
            weapon_2: 0,
            equipment_0: 0, //equipment is 1 indexed
            equipment_1: 1,
            equipment_2: 1,
            equipment_3: 1,
            equipment_4: 1,
            equipment_5: 0,
        };

        let found = {
            equipmentslots: 5,
            test_1: 0,
            weapon_2: 0,
            equipment_0: 0, //equipment is 1 indexed
            equipment_1: 1,
            equipment_2: 1,
            equipment_3: 1,
            equipment_4: 1,
            equipment_5: 0,
        };

        assert.equal(null, equipped.findNextAvailableSlotIndex(noequipmentslot));
        assert.equal(null, equipped.findNextAvailableSlotIndex(noempty))
        assert.equal(null, equipped.findNextAvailableSlotIndex(exceeds))
        assert.equal(5, equipped.findNextAvailableSlotIndex(found))
    });
    
    it('generatesBlankEquipmentObj', function(){
        let result = equipped.generateBlankEquipmentObj(1);
        let result2 = equipped.generateBlankEquipmentObj(2);
        
        assert.ok(`${character.equipmentslots.type}_name_1` in result);
        assert.ok(`${character.equipmentslots.type}_damage_1` in result);
        assert.ok(`${character.equipmentslots.type}_description_1` in result);
        assert.ok(`${character.equipmentslots.type}_name_2` in result2);
        assert.ok(`${character.equipmentslots.type}_damage_2` in result2);
        assert.ok(`${character.equipmentslots.type}_description_2` in result2);

        assert.equal(result[`${character.equipmentslots.type}_name_1`], '');
        assert.equal(result[`${character.equipmentslots.type}_damage_1`], '');
        assert.equal(result[`${character.equipmentslots.type}_description_1`], '');
        assert.equal(result2[`${character.equipmentslots.type}_name_2`], '');
        assert.equal(result2[`${character.equipmentslots.type}_damage_2`], '');
        assert.equal(result2[`${character.equipmentslots.type}_description_2`], '');
        
        let fields = {
            test1: {
                id: 'test1',
                default: 'wow'
            }
        };
        
        let result3 = equipped.generateBlankEquipmentObj(1, fields);
        assert.ok(`${character.equipmentslots.type}_test1_1` in result3);
        assert.equal(result3[`${character.equipmentslots.type}_test1_1`], 'wow');
    });

    it('getSlotFields', function(){
        assert.equal(character.equipmentslots.max, equipped.getSlotFields().length);
        assert.ok(equipped.getSlotFields().includes('equipment_1'));

    })
    
    it('getItemFieldIds', function(){
        let keys = Object.keys(card);
        keys.push(card.uses.max);
        keys = keys.sort();

        let test = equipped.getItemFieldIds().sort();


        assert.deepEqual(test, keys);

        let keys2 = keys.map(x => x + '_1');
        let test2 = equipped.getItemFieldIds(1).sort();

        assert.deepEqual(keys2, test2);


        let keys3 = keys.map(x => 'repeating_inventory_' + x ).sort();
        let test3 = equipped.getItemFieldIds('', 'repeating_inventory').sort();

        assert.deepEqual(keys3, test3);

        let keys4 = keys.map(x => 'repeating_inventory_' + x + '_3').sort();
        let test4 = equipped.getItemFieldIds('3', 'repeating_inventory').sort();

        assert.deepEqual(keys4, test4);
    });

    it('equipstest', function(){
        let equipped = equip({
            name: {
                id: 'name'
            },
            weight: {
                id: 'weight'
            }
        });

        let values = {
            equipmentslots: 3,
            equipment_1: 1,
            equipment_2: 0
        }

        values[character.equipmentslots.id] = 3;
        values[`${character.equipmentslots.type}_1`] = 1;
        values[`${character.equipmentslots.type}_2`] = 0;
        values[`repeating_${character.inventory.id}_name`] = 'test1';
        values[`repeating_${character.inventory.id}_weight`] = 'test2';

        let ind = equipped.findNextAvailableSlotIndex(values);

        let inventoryFields = Object.keys(values)
            .filter(x => x.includes(`repeating_${character.inventory.id}`))
            .reduce((obj, key) => {
                obj[key] = values[key];
                return obj;
            }, {});

        let newEquipment = equipped.remapKeys(inventoryFields, `_${ind}`, false, (x) => { return x.replace(`repeating_${character.inventory.id}_`, `${character.equipmentslots.type}_`);});

        newEquipment[`${character.equipmentslots.type}_2`] = 'on';

        let expected = {}

        expected[`${character.equipmentslots.type}_name_2`] = 'test1';
        expected[`${character.equipmentslots.type}_weight_2`] = 'test2';
        expected[`${character.equipmentslots.type}_2`] = 'on';

        assert.deepEqual( newEquipment, expected);
    });

    it('unequipstest', function(){
        let equipped = equip({
            name: {
                id: 'name'
            },
            weight: {
                id: 'weight'
            }
        });

        let values = {}

        values[`${character.equipmentslots.type}_name_1`] = 'test';
        values[`${character.equipmentslots.type}_weight_1`] = 'test2';

        const newInvItem = equipped.remapKeys(values,  `repeating_${character.inventory.id}_-12345_`, true, function(x){ 
            let result = x.replace('equipment_', '');
            let last = result.lastIndexOf('_1'); //lastIndex so we make sure to only get the end
            
            if (last > 0){
                return result.substring(0, last);
            } else {
                return result;
            }
        });

        newInvItem[`${character.equipmentslots.type}_1`] = 0;

        let expected = {};

        expected[`repeating_${character.inventory.id}_-12345_name`] = 'test';
        expected[`repeating_${character.inventory.id}_-12345_weight`] = 'test2';
        expected[`${character.equipmentslots.type}_1`] = 0;

        assert.deepEqual(expected, newInvItem);


    })
});