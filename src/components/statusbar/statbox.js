import React from 'react';
import NumberInput from '../inputs/numberinput';
import { styled } from '@linaria/react';
import { colors, sizes, fonts } from '../../styles/vars';
import Box from './box';
import ToolTip from '../inputs/tooltip';


export default function StatBox(props){

    const StatBox = styled.div`
        .label-text {
            font-size: ${sizes.xLarge};
            text-align: center;
            color: ${colors.bloodred};
            font-family: ${fonts.shadows};
            font-weight: 700;
            text-transform: uppercase;
            text-shadow: 0.15rem 0.15rem $black;
        }

        .stat-label button{
            border: none;
            font-size: 0;
            vertical-align: middle;
            width: 10px;
            background: url(https://img.icons8.com/ios-glyphs/30/000000/refresh--v1.png) no-repeat center;
            background-size: contain;
            transition: 0.3s;
            border-radius: 2rem;

            &:hover{
                background-color: ${colors.white};
            }

            &:active {
                background-color: ${colors.bloodred};
            }
        }


        .stat-wrapper {
            display: flex;
            flex-direction: column;
        }

        .main {
            text-align: center;
        }

        .sub {
            font-size: ${sizes.small};
            margin-top: 0.4rem;
            text-align: center;

            input {
                font-size: ${sizes.small};
                padding: 0;
                font-weight: 300;
                color: ${colors.black}; 
            }
        }
        
        input {
            background-color: ${colors.darkgray};
            color: ${colors.black}; 
            font-size: ${sizes.xLarge};
            text-align: center;
            font-weight: 700;
            border: none;
        }
    `;


    return (
        <Box>
            <StatBox className={`stat-box ${props.stat.key}`}>
                <div className="stat-label label-text">
                    { props.stat.label ?? props.stat.key.charAt(0).toUpperCase() + props.stat.key.slice(1)}
                    { props.stat.action ? <button type='action' name={props.stat.action}>{props.stat.actiontext ?? ''}</button> : ''}
                    { props.stat.tip ? <ToolTip text={props.stat.tip} margin={'0 0.5rem'} display='inline-block'/> : ''}
                </div>
                <div className="stat-wrapper">
                    <div className="main">
                        <NumberInput field={props.stat} />
                    </div>
                    { props.stat.max ? <div className="sub">Max: <NumberInput field={props.stat} max={true}/></div> : ''}
                </div>
            </StatBox>
        </Box>
    )
}