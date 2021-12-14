import React from 'react';
import { styled } from '@linaria/react';
import { colors } from '../../styles/vars';

const InputShy = styled.input`
    transition: 0.3s;
    font-size: 1.6rem;
    border:none;

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


export default function NumberInput(props){
    return (
        <InputShy type="number" name={`attr_${props.field.key}${props.max ? '_max': ''}`} defaultValue={props.field.default ?? 0} />
    )
}