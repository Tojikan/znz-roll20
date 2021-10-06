
import Field from "./_field";
import FieldGroup from "./_fieldGroup";
import SheetObject from "./_sheetObject";
import abilities from './abilities.json';

export class Character extends SheetObject{

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
                    "d20"
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
                new Field("equipmentslots", {default: 2, max: 5, prefix:"equipment"}, 'Equipment'),
                new Field("inventoryslots", {default: 5, max: 10, prefix:"inventory"}, 'Inventory')
            ])
        ]
    );
}


const flds = Character.sheetObj.getFields();

export const fields = flds;

