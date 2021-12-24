import React from 'react';
import { NumberLineInput, NumberLineInputStyle, NumberLineLabel } from '../inputs/numberinput';
import { styled } from '@linaria/react';
import { colors } from '../../styles/vars';
import { RollButton } from '../inputs/rollbutton';
import { ToolTip } from '../inputs/tooltip';

export const AttrStatStyle = styled.div`

    ${NumberLineInputStyle} {
        border-bottom: solid 1px ${colors.lightgray};
        border-left: solid 1px ${colors.lightgray};
        padding-left: 0.7rem;
        align-items: center;


        ${NumberLineLabel} {
            font-weight: 700;
            flex-grow: 1;
            text-align: left;
        }

        button {
            margin: 0 1rem;
        }


        input {
            border-left: solid 1px ${colors.lightgray};
            border-right: solid 1px ${colors.lightgray};
            border-radius: 0;
            text-align: center;
            width: 4rem!important;
        }
    }
`;

export function AttributeStat( props ){


    return (
        <AttrStatStyle>
            <NumberLineInput field={props.field}>
            { props.field.tip ? <ToolTip text={props.field.tip} bottom={true}/> : ''}
                <RollButton value='!!zroll'/>
            </NumberLineInput>
        </AttrStatStyle>
    )
}