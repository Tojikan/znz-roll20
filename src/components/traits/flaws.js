import React from 'react';
import { styled } from '@linaria/react';
import { TraitBox } from './_traits';
import { SelectInput } from '../field/input';
import { ToolTip, ToolTipIcon } from '../field/tooltip';
import { affixKey } from '../../lib/znzlib';
import { CheckboxSwitch } from '../field/switch';
import { IconActionButton } from '../field/button';


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
                default={{label:"", key:"none"}}
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
            <CheckboxSwitch field={props.field} value="none">
                <IconActionButton action={`randomize_${props.field.key}`}>
                    Randomize
                </IconActionButton>
            </CheckboxSwitch>
        </Row>
    )
}


export function FlawBox( props ) {

    let flawRows = [];

    for (let i = 0; i < props.count; i++){
        let prefixed = affixKey(null, props.field, i);
        flawRows.push(
            <FlawRow
                field={prefixed}
                options={props.options}
                key={i}
                index={i}
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