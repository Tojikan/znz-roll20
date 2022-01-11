import React from 'react';
import { styled } from '@linaria/react';
import { colors, sizes } from '../../styles/vars';
import { capitalize } from '../../lib/znzlib';



//#region  Basic Number Input 
    export const NumberInputStyle = styled.input`
        transition: 0.3s;
        font-size: 1.6rem;
        border: none;
        border-bottom: ${props => props.underline ? `solid 1px ${colors.black}` : 'none'};

        &:hover {
            background-color: ${colors.lightblue};
        }
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button{
            -webkit-appearance: none; /* Chrome */
            margin: 0; /* Apparently some margin are still there even though it's hidden */
        }
        &[type=number]{
            -moz-appearance:textfield; /* Firefox */
        }
    `;

    export function NumberInput(props){
        return (
            <NumberInputStyle type="number" name={`attr_${props.field.key}${props.max ? '_max': ''}`} defaultValue={props.field.default ?? 0} underline={props.underline} />
        )
    }
//#endregion