import React from 'react';
import { NumberInput } from '../field/input';
import { styled } from '@linaria/react';
import { colors, sizes, fonts } from '../../styles/vars';
import { StatusBarBox, BoxLabel } from './box';
import { ToolTip } from '../field/tooltip';


export default function StatBox(props){

    const StatBox = styled.div`
        .stat-label {
            display: flex;
            align-items: center;
            justify-content: center;
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
                font-weight: 300;
                color: ${colors.black}; 
            }
        }
        
        input {
            color: ${colors.black}; 
            font-size: ${sizes.xLarge};
            font-weight: 700;
            border: none;
        }
    `;


    return (
        <StatusBarBox>
            <StatBox className={`stat-box ${props.stat.key}`}>
                <div className="stat-label label-text">
                    <BoxLabel>
                        <ToolTip text={props.stat.tip}>
                        { props.stat.label ?? props.stat.key.charAt(0).toUpperCase() + props.stat.key.slice(1)}
                        </ToolTip>
                    </BoxLabel>
                    { props.stat.action ? <button type='action' name={props.stat.action}>{props.stat.actiontext ?? ''}</button> : ''}
                </div>
                <div className="stat-wrapper">
                    <div className="main">
                        <NumberInput field={props.stat} />
                    </div>
                    { props.stat.max ? <div className="sub">Max: <NumberInput field={props.stat} max={true}/></div> : ''}
                </div>
            </StatBox>
        </StatusBarBox>
    )
}