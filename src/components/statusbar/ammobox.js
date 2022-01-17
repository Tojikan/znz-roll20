import React from 'react';
import { NumberInput } from '../field/input';
import { styled } from '@linaria/react';
import { sizes } from '../../styles/vars';
import { StatusBarBox, BoxLabel} from './box';
import { LabelledFlex } from '../field/label';
import { getLabel } from '../../lib/znzlib';
import { ToolTip } from '../field/tooltip';

export default function AmmoBox(props){

    const AmmoBox = styled.div`
        font-size: ${sizes.small};
    `;




    return (
        <StatusBarBox>
            <AmmoBox>
                <BoxLabel>
                    Ammo
                </BoxLabel>
                {
                    props.list.map((x, i) =>{
                        return (
                            <LabelledFlex label={
                                <ToolTip text={x.tip}>
                                    {getLabel(x)}
                                </ToolTip>
                                } key={i}>
                                <NumberInput field={x} underline={false} key={x.key}/>
                            </LabelledFlex>
                        )
                    })
                }
            </AmmoBox>
        </StatusBarBox>
    )
}