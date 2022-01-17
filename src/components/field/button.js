import React from 'react';
import { styled } from '@linaria/react';
import { colors, sizes } from '../../styles/vars';

export const RollButtonStyle = styled.button`
    transition: 0.3s;
    border: none;
    background-color: transparent;
    margin: 0!important;

    &:before {
        font-size: 2rem;
    }


    &:hover {
        color: ${colors.bloodred};
    }
`


export function RollButton(props){
    return (
        <RollButtonStyle type="roll" value={props.value} />
    )
}