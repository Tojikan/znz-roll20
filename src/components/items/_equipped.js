import React from 'react'
import { styled } from '@linaria/react';
import { CharacterModel } from '../../data/character';
import { Equipped } from '../../data/item';
import { Item } from './itemcard';
import { SlotsList } from './slot';
import { NumberInput } from '../field/input';
import { SlotEntryRow } from './sharedCss';


export function EquipmentSlots(){

    let slotCount = CharacterModel.equipmentslots.count;
    let cardComponents = [];

    //Slots and cards are 1 indexed
    for (let i = 1; i <= slotCount; i++){
        cardComponents.push(
            <Item index={i} />
        );
    }

    return (
        <div className="equipment-section">

            <SlotEntryRow>
                <h2>Equipment</h2>
                <div className="slot-entry">
                    Slots: 
                    <NumberInput field={CharacterModel.equipmentslots} />
                </div>
            </SlotEntryRow>
            <SlotsList 
                equippedField={Equipped} 
                slotField={CharacterModel.equipmentslots}
                list={cardComponents}    
            />
        </div>
    )
}


