import React from 'react'
import { styled } from '@linaria/react';
import { CharacterModel } from '../../data/character';
import { Equipped, ItemModel } from '../../data/item';
import { ItemCard } from './itemcard';
import { SlotsList } from './slot';
import { affixKey } from '../../lib/znzlib';
import { NumberInput } from '../field/input';
import { sizes } from '../../styles/vars';



export function EquipmentSlots(){


    let slotCount = CharacterModel.equipmentslots.count;
    let cardComponents = [];

    //Slots and cards are 1 indexed
    for (let i = 1; i <= slotCount; i++){
        cardComponents.push(`Item ${i}`);
    }

    const LabelRow = styled.div`
        display: flex;
        justify-content: start;
        align-items: baseline;

        h2 {
            font-size: ${sizes.large};
            margin-right: 3rem;
        }

        .equipment-slot-entry {
            font-size: ${sizes.small};

            input {
                font-size: ${sizes.small}!important;
            }
        }

    `


    return (
        <div className="equipment-section">

            <LabelRow>
                <h2>Equipment</h2>
                <div className="equipment-slot-entry">
                    Slots: 
                    <NumberInput field={CharacterModel.equipmentslots} />
                </div>
            </LabelRow>
            <SlotsList 
                equippedField={Equipped} 
                slotField={CharacterModel.equipmentslots}
                list={cardComponents}    
            />
        </div>
    )
}