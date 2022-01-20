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

export function BasicRollButton(props) {

    const BasicButtonStyle = styled.button`
        margin-bottom: 1rem;
        border: solid 1px ${colors.darkgray};
        border-radius: 0;

        &:before {
            content: none!important;
        }
    `

    return (
        <BasicButtonStyle type="roll" value={props.value} >
            {props.children}
        </BasicButtonStyle>
    )
}

export function ActionButton(props) {

    const ActionButtonStyle = styled.button`
        margin-bottom: 1rem;
        border: solid 1px ${colors.darkgray};
        border-radius: 0;
        background-color: ${props => props.red ? colors.lightred : 'initial'};
        color: ${props => props.red ? colors.white : 'initial'};
        padding: 2px 3px;
        display: inline-block;
        vertical-align: middle;

        &:before {
            content: none!important;
        }

    `

    return (
        <ActionButtonStyle type="action" name={`act_${props.action}`} red={props.red} >
            {props.children}
        </ActionButtonStyle>
    )
}