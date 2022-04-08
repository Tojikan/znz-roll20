import React from 'react';
import { styled } from '@linaria/react';
import { colors, sizes, fonts } from '../../styles/vars';
import { props } from 'bluebird';


export function BoxLabel(props){
    
    const Label = styled.div`
        font-size: ${sizes.xLarge};
        font-weight: 700;
        font-family: ${fonts.shadows};
        color: ${colors.bloodred};
        text-transform: uppercase;
        text-align: center;
        text-shadow: 0.07rem 0.07rem ${colors.black};
    `;

    return (
        <Label className={props.className}>{props.children}</Label>
    )
}


export function StatusBarBox(props){

    const Box = styled.div`
        min-width: 10.5rem;
        border: solid 2px;
        border-color: #727274 #262626 #262626 #727274;
        padding: 0.5rem;
        padding-top: 0;

        input {
            padding: 0;
            background-color: ${colors.darkgray};
            text-align: center;
            width: 4.5rem!important;
        }
    `;


    return (
        <Box className={props.className}>
            { props.children }
        </Box>
    )
}