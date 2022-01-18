import React from 'react'
import { styled } from '@linaria/react';
import { colors } from '../../styles/vars';
import { HiddenInput } from '../field/input';
import { CardBorder } from './_equipped';
import { affixKey } from '../../lib/znzlib';
import { SlotTriggerCSS } from './dynamicCSS';


export function Slot( props ){

    const SlotContent = styled.div`
        display: none;
    `

    const SlotWrapper = styled.div`
        .slot-content-control:checked {
            & + .slot-content {
                display: block;
            }
        }
    `;

    return (
        <CardBorder className={props.className}>
            <SlotWrapper>
                {/** This Checkbox is used to determine if this slot has been equipped. SlotContent displays if this element is checked **/}
                <HiddenInput type="checkbox" field={props.equipField} className="slot-content-control" checked={ props.index <= 1 ? 'checked' : ''}/>
                <SlotContent className="slot-content">
                    { props.children }
                </SlotContent>
            </SlotWrapper>
        </CardBorder>
    )
}


export function SlotsList( props ){

    const SlotsListWrapper = styled.div`
        display: flex;
        flex-wrap: wrap;
        margin-left: -1rem;
        margin-right: -1rem;

        ${SlotTriggerCSS}

    `

    const SlotWrap = styled.div`
        flex-basis: 31%;
        padding: 0 0.5rem;
        margin-bottom: 2rem;
        display: none;

        @media screen and (max-width: 680px) {
            flex-basis: 47%;
        }

        @media screen and (max-width: 580px) {
            flex-basis: 100%;
        }
    `;

    return (
        <SlotsListWrapper>
            {/* {slotsDisplay} */}
            {props.list.map((x,i) =>{
                // This checkbox determines how many slots are available.
                return (
                    <HiddenInput key={i} type="checkbox" className={`slot-trigger-${i+1}`} field={props.slotField} value={i+1} checked={i <= 1 ? 'checked' : ''}/>
                    )
                })}

            { props.list.map((x,i) =>{
                return (
                    <SlotWrap key={i} className={`slot_${i+1}`}>
                        {/**  equipField determines if an item is equipped**/}
                        <Slot equipField={affixKey(null, props.equippedField, i+1)} index={i}> 
                            {x}
                        </Slot>
                    </SlotWrap>
                )
                
            })}

        </SlotsListWrapper>
    )
}