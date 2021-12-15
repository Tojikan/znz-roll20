import React from 'react';
import { styled } from '@linaria/react';
import { colors, sizes, fonts, breakpoints } from '../../styles/vars';
import { Box, BoxLabel } from './box';
import LineList from '../inputs/linelist';

export default function OptionsBox(props){
    const OptionsBox = styled.div`
        flex: 100%;

        @media screen and (max-width: ${breakpoints.md}) {
            display: flex;
            align-items: center;
            height: 100%;
        }

        .option-list {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            padding: 0 2rem;

            @media screen and (max-width: ${breakpoints.md}) {
                justify-content: start;
            }
        }

        .option-line {
            margin-bottom: 1rem;

            @media screen and (max-width: ${breakpoints.md}) {
                margin-right: 2rem;
                margin-bottom: 0;
            }
        }

        .option-label {
            font-weight: 700;
        }
    `;

    const OptionBoxLabel = styled(BoxLabel)`
        @media screen and (max-width: ${breakpoints.md}) {
            font-size: ${sizes.medium};
            margin-right: 5rem;
        }
    `;

    const ResponsiveBox = styled(Box)`
        height: 100%;
        @media screen and (max-width: ${breakpoints.md}) {
            position: absolute;
            bottom: 100%;
            left: 0;
            height: 3rem;
            right: 0;
            background-color: ${colors.darkgray};
        }
    `;

    return (
        <OptionsBox>
            <ResponsiveBox>
                <OptionsBox>
                    <OptionBoxLabel>
                        Roll Options
                    </OptionBoxLabel>

                    <LineList lineClass='option-line' 
                                labelClass='option-label' 
                                className='option-list' 
                                list={props.options} 
                                underline={true}
                                />

                </OptionsBox>
            </ResponsiveBox>
        </OptionsBox>
    )
}