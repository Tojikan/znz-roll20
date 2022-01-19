import React from 'react';
import { styled } from '@linaria/react';
import { colors, sizes } from '../../styles/vars';
import { StatusBarBox, BoxLabel } from './box';
import { NumberInput, ToggleInput } from '../field/input';
import { LabelledFlex, LabelText, LabelFlexBox } from '../field/label';
import { getLabel } from '../../lib/znzlib';
import { StatusBarHeight } from '../../styles/vars';

export default function OptionsBox(props){
    const OptionsBox = styled(StatusBarBox)`
        flex: 100%;
        height: 100%;
        
        @media screen and (max-width: 787px) {
            position: absolute;
            bottom: 100%;
            left: 0;
            height: 3rem;
            right: 0;
            background-color: ${colors.darkgray};
            display: flex;
            align-items: center;
        }
        
        ${LabelFlexBox} {
            margin-right: 1rem;

            @media screen and (min-width: 787px) {
                margin-right: 0;
                margin-bottom: 1rem;
            }
        }

        ${LabelText} {
            font-weight: 700;
        }
    `;

    const OptionBoxLabel = styled(BoxLabel)`
        @media screen and (max-width: 787px) {
            font-size: ${sizes.medium};
            margin-right: 2rem;
        }
    `;

    const OptionsBoxContent = styled.div`
        display: flex;
        align-items: center;
        
        @media screen and (min-width: 787px){
            flex-direction: column;
            align-items: flex-start;
            flex-wrap: wrap;
            height: ${ StatusBarHeight.mobile };
        }
    `


    return (
        <OptionsBox>
            <OptionBoxLabel>
                Roll Options
            </OptionBoxLabel>
            <OptionsBoxContent>
                {
                    props.toggleOptions.map((x, i)  => {
                        return (
                            <LabelledFlex label={getLabel(x)} key={i}>
                                <ToggleInput field={x} />
                            </LabelledFlex>
                        )
                    })
                }
                {
                    props.numberOptions.map((x, i) => {
                        return (
                            <LabelledFlex label={getLabel(x)} key={i}>
                                <NumberInput field={x} underline={true} key={x.key}/>
                            </LabelledFlex>
                        )
                    })
                }
            </OptionsBoxContent>
        </OptionsBox>
    )
}