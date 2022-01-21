import React from 'react';
import { styled } from '@linaria/react';
import { colors, sizes } from '../../styles/vars';
import { StatusBarBox, BoxLabel } from './box';
import { NumberInput, ToggleInput } from '../field/input';
import { LabelledFlex, LabelText } from '../field/label';
import { getLabel } from '../../lib/znzlib';
import { ToolTip } from '../field/tooltip';

export default function OptionsBox(props){
    const OptionsBox = styled(StatusBarBox)`
        display: flex;
        align-items: center;
        background-color: ${colors.darkgray};
        padding-top: 0.5rem;

        ${LabelText} {
            font-weight: 700;
        }
    `;

    const OptionBoxLabel = styled(BoxLabel)`
        margin-right: 3rem;
        font-size: ${sizes.xLarge};
    `;

    const OptionsBoxContent = styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-basis: 75%;
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
                            <LabelledFlex label={
                                <ToolTip text={x.tip}>
                                    {getLabel(x)}
                                </ToolTip>
                            } key={i}>
                                <ToggleInput field={x} />
                            </LabelledFlex>
                        )
                    })
                }
                {
                    props.numberOptions.map((x, i) => {
                        return (
                            <LabelledFlex label={
                                <ToolTip text={x.tip}>
                                    {getLabel(x)}
                                </ToolTip>
                            } key={i}>
                                <NumberInput field={x} underline={true} key={x.key}/>
                            </LabelledFlex>
                        )
                    })
                }
            </OptionsBoxContent>
        </OptionsBox>
    )
}