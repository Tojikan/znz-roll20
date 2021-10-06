const Field = require("./_field");
const FieldGroup = require("./_fieldGroup");
const SheetObject = require("./_sheetObject");
const char = require('./character');

const ammotypes = char.fields.ammo.types.map(x=> char.fields.ammo.id + '_' + x);

class Card extends SheetObject{
    static sheetObj = new SheetObject(
        [
            new Field(`name`, {input: 'text'}, 'Name'),
            new Field(`type`,{
                input: 'select',
                options: [
                    'consumable',
                    'weapon',
                    'equipment'
                ],
            }, "Item Type"),
            new Field(`damage`, {only:'weapon', input:'dice'}, 'Damage'),
            new Field(`weapontype`, {
                only:'weapon',
                input: 'select',
                options: ['melee', 'ranged']
            }, 'Weapon Type'),
            new Field(`uses`, {
                only:'weapon',
                input: 'max',
                max: 'uses_max',
                text: {
                    melee: 'Durability',
                    ranged: 'Ammo'
                }
            }, 'Uses'),
            new Field(`ammotype`, {
                only:'weapon',
                onselect: 'ranged',
                input: 'select',
                options:  ammotypes
            }, 'Ammo Type'),
            new Field(`description`, {input: 'textarea'}, 'Description'),
            new Field(`effect`, {input: 'textarea'}, 'Effect'),
            {
                prefixes: {
                    inv: "card",
                    equip: "equipment",
                    weapon: "weapon"
                }
            },
            new Field('actions', {
                drop:'dropItem', 
                delete:'deleteItem',
                attack:'attackWeapon',
                reload: 'reloadWeapon',
                equip: 'equipItem',
                consume: 'consumeItem',
                unequip: 'unequipItem'
            }),
            {prefix: 'item'}
        ]
    )
}


module.exports = {
    fields: Card.sheetObj.getFields(),
    actor: Card
}