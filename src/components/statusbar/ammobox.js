import React from 'react';
import NumberInput from '../inputs/numberinput';
import { styled } from '@linaria/react';
import { colors, sizes, fonts } from '../../styles/vars';
import Box from './box';
import LineList from '../inputs/linelist';

export default function AmmoBox(props){

    const AmmoBox = styled.div`
        font-size: ${sizes.small};

        input {
            padding: 0;
            background-color: ${colors.darkgray};
            text-align: center;
        }
        `;

    const Label = styled.div`
        font-size: ${sizes.xLarge};
        font-weight: 700;
        font-family: ${fonts.shadows};
        color: ${colors.bloodred};
    `;


    return (
        <Box>
            <AmmoBox>
                <Label>
                    Ammo
                </Label>
                <LineList list={props.list}/>
            </AmmoBox>
        </Box>
    )
}