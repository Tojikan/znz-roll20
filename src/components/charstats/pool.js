import React from 'react';
import { NumberInputStyle, NumberInput } from '../inputs/numberinput';
import { styled } from '@linaria/react';
import { colors, sizes } from '../../styles/vars';
import { RollButton, RollButtonStyle } from '../inputs/rollbutton';
import { ToolTip } from '../inputs/tooltip';

export const PoolStatStyle = styled.div`
    display: flex;
    align-items: center;

    .input-wrapper {
        background-color: ${colors.black};
        border: solid 4px ${colors.black}
    }

    ${NumberInputStyle} {
        background-color: ${colors.black};
        color: ${colors.white};
        text-align: center;
        font-size: ${sizes.xLarge};
        width: 6rem!important;
        padding: 1.6rem 0;
        border: solid 1px ${colors.white}
    }
`;

export const PoolStatLabelStyle = styled.div`
    background-color: ${colors.black};
    padding: 0.4rem 0;
    font-size: ${sizes.xLarge};
    color: ${colors.white};
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 2rem;

    ${RollButtonStyle} {
        background-color: transparent;
        border: none;
        margin-right: 1.5rem!important;
        justify-self: flex-end;
    }
`;

export function PoolStat(props){
    //TODO Roll Button
    return (
        <PoolStatStyle>
            <div className="input-wrapper">
                <NumberInput field={props.field} />
            </div>
            <PoolStatLabelStyle>
                <span>
                    <ToolTip text={props.field.tip} bottom={true}>
                        {props.label.toUpperCase()}
                    </ToolTip>
                </span>
                <RollButton value='!!zroll'/>
            </PoolStatLabelStyle>
        </PoolStatStyle>
    )
}