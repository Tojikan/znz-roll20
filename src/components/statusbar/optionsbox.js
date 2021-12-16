import React from 'react';
import { styled } from '@linaria/react';
import { colors, sizes, fonts, breakpoints } from '../../styles/vars';
import { Box, BoxLabel } from './box';
import { NumberLineInput, NumberLineInputStyle, NumberLineLabel } from '../inputs/numberinput';
import { statusbarVars } from './statusbar-vars';

export default function OptionsBox(props){
    const OptionsBox = styled(Box)`
        flex: 100%;
        height: 100%;
        
        //Collapse to top of status bar on smaller screens
        @media screen and (max-width: ${breakpoints.md}) {
            position: absolute;
            bottom: 100%;
            left: 0;
            height: 3rem;
            right: 0;
            background-color: ${colors.darkgray};
            display: flex;
            align-items: center;
        }
        
        ${NumberLineInputStyle} {
            margin-right: 1rem;

            @media screen and (min-width: ${breakpoints.md}) {
                margin-right: 0;
                margin-bottom: 1rem;
            }
        }

        ${NumberLineLabel} {
            font-weight: 700;
        }
    `;

    const OptionBoxLabel = styled(BoxLabel)`
        @media screen and (max-width: ${breakpoints.md}) {
            font-size: ${sizes.medium};
            margin-right: 2rem;
        }
    `;

    const OptionsBoxContent = styled.div`
        display: flex;
        align-items: center;
        
        @media screen and (min-width: ${breakpoints.md}){
            flex-direction: column;
            align-items: flex-start;
            flex-wrap: wrap;
            height: ${ statusbarVars.barheight };
        }
    `


    return (
        <OptionsBox>
            <OptionBoxLabel>
                Roll Options
            </OptionBoxLabel>
            <OptionsBoxContent>
                {
                    props.options.map((x) => {
                        return (
                            <NumberLineInput field={x} underline={true}/>
                        )
                    })
                }
            </OptionsBoxContent>
        </OptionsBox>
    )
}