import React from 'react';
import { NumberInput, NumberInputStyle, NumberLineLabel } from '../inputs/numberinput';
import { styled } from '@linaria/react';
import { capitalize } from '../../lib/znzlib';
import { RollButton } from '../inputs/rollbutton';
import { ToolTip } from '../inputs/tooltip';
import { sizes, colors } from '../../styles/vars';

export const AttributeLabel = styled.div`
    font-size: ${sizes.medium};
    font-weight: 700;
`;

export const AttributeStyle = styled.div`
    border-bottom: solid 1px ${colors.lightgray};
    border-left: solid 1px ${colors.lightgray};
    padding-left: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    input {
        border-left: solid 1px ${colors.lightgray};
        border-right: solid 1px ${colors.lightgray};
        border-radius: 0;
        text-align: center;
        width: 4rem!important;
    }

    button {
        margin: 0 1rem;
        display: flex;
        align-items: center;
    }

    ${AttributeLabel} {
        flex-grow: 1;
        text-align: left;
    }
`;

export function Attribute( props ){
    return (
        <AttributeStyle>
            <AttributeLabel >
                <ToolTip text={props.field.tip} bottom={true}>
                    {props.field.label ? props.field.label : capitalize(props.field.key)}
                </ToolTip>
            </AttributeLabel>
            <RollButton value='!!zroll'/>
            <NumberInput field={props.field}/>
        </AttributeStyle>
    )
}