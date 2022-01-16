import React from 'react';
import { NumberInput } from '../field/input';
import { styled } from '@linaria/react';
import { sizes } from '../../styles/vars';
import { Box, BoxLabel} from './box';
import { LabelledFlex } from '../field/label';
import { getLabel } from '../../lib/znzlib';

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
                    props.list.map((x, i) =>{
                        return (
                            <LabelledFlex label={getLabel(x)} key={i}>
                                <NumberInput field={x} underline={false} key={x.key}/>
                            </LabelledFlex>
                        )
                    })
                }
            </AmmoBox>
        </Box>
    )
}