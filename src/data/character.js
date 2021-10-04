
const Field = require("./_field");
const FieldGroup = require("./_fieldGroup");
const SheetObject = require("./_sheetObject");
const abilities = require('./abilities.json');

class Character extends SheetObject{

    constructor(character){
        this.character;
    }

    static sheetObj = new SheetObject(
        [
            new Field("name"),
            new Field("ammo", {types:[
                    "d4",
                    "d6",
                    "d8",
                    "d10",
                    "d12",
                ]}),
            new FieldGroup('stats', [
                new Field("health", {default: 30}),
                new Field("energy", {default: 40}),
            ]),
            new Field('defense', {
                    default: 5,
                    bonus: true
                } 
            ),
            new Field('ability',{
                options: abilities
            }),
            new FieldGroup('slots',[
                new Field("weaponslots", {default: 1, max: 4, prefix:"weapon"}, 'Weapons'),
                new Field("equipmentslots", {default: 2, max: 4, prefix:"equipment"}, 'Equipment'),
                new Field("inventoryslots", {default: 5, max: 10, prefix:"card"}, 'Inventory')
            ])
        ]
    );
}


module.exports = {
    fields: Character.sheetObj.getFields(),
    actor: Character
}

