import React from 'react';
import NumberInput from '../inputs/numberinput';
import { styled } from '@linaria/react';
import { colors, sizes, fonts } from '../../styles/vars';
import { Box, BoxLabel} from './box';
import LineList from '../inputs/linelist';

export default function AmmoBox(props){

    const AmmoBox = styled.div`
        font-size: ${sizes.small};
        `;

    return (
        <Box>
            <AmmoBox>
                <BoxLabel>
                    Ammo
                </BoxLabel>
                <LineList list={props.list}/>
            </AmmoBox>
        </Box>
    )
}