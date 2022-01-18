import React from 'react'
import { styled } from '@linaria/react';
import { colors } from '../../styles/vars';
import { HiddenInput } from '../field/input';
import { CheckboxSwitch } from '../field/switch';
import { affixKey } from '../../lib/znzlib';

export const CardBorder  = styled.div`
    border: solid 4px ${colors.lightgray};
    border-radius: 1rem;
    padding: 1rem;
`


export function Slot( props ){

    const SlotContent = styled.div`
        display: none;
    `

    const SlotWrapper = styled.div`
        display: none;


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
                <HiddenInput type="checkbox" field={props.equipField} className="slot-content-control"/>
                <SlotContent className="slot-content">
                    { props.children }
                </SlotContent>
            </SlotWrapper>
        </CardBorder>
    )
}


export function SlotsList( props ){

    let slotsDisplayStyle = '.slot-trigger-1:checked{ ~ .slot_1 { display: block; }}.slot-trigger-2:checked{ ~ .slot_2 { display: block; } ~ .slot_1 { display: block; }}.slot-trigger-3:checked{ ~ .slot_3 { display: block; } ~ .slot_2 { display: block; } ~ .slot_1 { display: block; }}.slot-trigger-4:checked{ ~ .slot_4 { display: block; } ~ .slot_3 { display: block; } ~ .slot_2 { display: block; } ~ .slot_1 { display: block; }}.slot-trigger-5:checked{ ~ .slot_5 { display: block; } ~ .slot_4 { display: block; } ~ .slot_3 { display: block; } ~ .slot_2 { display: block; } ~ .slot_1 { display: block; }}.slot-trigger-6:checked{ ~ .slot_6 { display: block; } ~ .slot_5 { display: block; } ~ .slot_4 { display: block; } ~ .slot_3 { display: block; } ~ .slot_2 { display: block; } ~ .slot_1 { display: block; }}';

    /**
     * For some reason using a loop and adding it directly to the style doesn't work? But if you paste the generated css directly as text, it'll work.
     * So as a workaround, uncomment this code and run it on a dev environment. Copy the output and then paste it above into slotsDisplayStyle.
     */
    // let slotsDisplay = '';
    // for (let i = 1; i <= props.list.length; i++){
    //     // If slot trigger i is checked...
    //     slotsDisplay += `.slot-trigger-${i}:checked{  `;

    //     // show all slots i and under
    //     for (let j = i; j > 0; j--) {
    //         slotsDisplay += ` ~ .slot_${j} {
    //             display: block;
    //         }`
    //     }

    //     slotsDisplay += '}'
    // }

    const SlotsListWrapper = styled.div`
        display: flex;
        flex-wrap: wrap;
        margin-left: -1rem;
        margin-right: -1rem;

        ${slotsDisplayStyle}

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
                    <HiddenInput key={i} type="checkbox" className={`slot-trigger-${i+1}`} field={props.slotField} value={i+1} />
                    )
                })}

            { props.list.map((x,i) =>{
                return (
                    <SlotWrap key={i} className={`slot_${i+1}`}>
                        {/**  equipField determines if an item is equipped**/}
                        <Slot equipField={affixKey(null, props.equippedField, i+1)}> 
                            {x}
                        </Slot>
                    </SlotWrap>
                )
                
            })}

        </SlotsListWrapper>
    )
}