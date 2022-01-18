import React from 'react';
import { styled } from '@linaria/react';
import { TraitBox } from './_traits';
import { SelectInput } from '../field/input';
import { ToolTip, ToolTipIcon } from '../field/tooltip';
import { suffixKey } from '../../lib/znzlib';
import { CheckboxSwitch } from '../field/switch';


export function FlawRow( props ){

    const Row = styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    `

    return (
        <Row>
            <SelectInput
                field={props.field} 
                options={props.options} 
                appearance={true} 
                underline={true} 
                default={{label:"", value:""}}
            />
            {
                props.options.map((x) =>{
                    return (
                        <CheckboxSwitch field={props.field} value={x.key} key={x.key}>
                            <ToolTip text={x.tip} left={true}>
                                <ToolTipIcon>?</ToolTipIcon>
                            </ToolTip>
                        </CheckboxSwitch>
                    )
                })
            }

        </Row>
    )
}


export function FlawBox( props ) {

    let flawRows = [];

    for (let i = 0; i < props.count; i++){
        let prefixed = suffixKey(props.field, i);
        flawRows.push(
            <FlawRow
                field={prefixed}
                options={props.options}
                key={i}
            />
        );
    }

    return (
        <TraitBox>
            <h2>Flaws</h2>
            {flawRows}
        </TraitBox>
    )
}