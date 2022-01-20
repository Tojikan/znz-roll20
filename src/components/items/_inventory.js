import React from 'react'
import { styled } from '@linaria/react';
import { CharacterModel } from '../../data/character';
import { Item } from './itemcard';
import { SlotsList } from './slot';
import { NumberInput } from '../field/input';
import { sizes } from '../../styles/vars';
import { colors } from '../../styles/vars';
import { CardBorder, SlotEntryRow } from './sharedCss';




export function Inventory(){

    const InventorySection = styled.div`
        margin-top: 1rem;

        .repcontainer {
            display: flex;
            flex-wrap: wrap;
            margin-left: -10px;
            margin-right: -10px;

            .repitem {
                flex-basis: 25%;
                padding: 0 0.5rem;
                margin-bottom: 2rem;
            }
        }

        .repcontrol {
            .repcontrol_edit {
                float: none;
                margin-right: 2rem;
            }
        }
    `



    return (
        <InventorySection>

            <SlotEntryRow>
                <h2>Inventory</h2>
                <div className="slot-entry">
                    Max Slots: 
                    <NumberInput field={CharacterModel.inventoryslots} />
                </div>
            </SlotEntryRow>

            <fieldset className={`repeating_${CharacterModel.inventory.key}`}>
                <CardBorder>
                    <Item inventory={true}/>
                </CardBorder>
            </fieldset>
        </InventorySection>
    )
}
