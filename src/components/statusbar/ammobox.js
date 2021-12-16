import React from 'react';
import { NumberInput, NumberLineInput } from '../inputs/numberinput';
import { styled } from '@linaria/react';
import { colors, sizes, fonts } from '../../styles/vars';
import { Box, BoxLabel} from './box';

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
                {
                    props.list.map((x) =>{
                        return (
                            <NumberLineInput field={x} underline={false}/>
                        )
                    })
                }
            </AmmoBox>
        </Box>
    )
}