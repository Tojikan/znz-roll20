import React from 'react';
import { styled } from '@linaria/react';
import { NumberInput, SelectInput, TextInput } from '../field/input';
import { colors, sizes } from '../../styles/vars';
import { ToolTip } from '../field/tooltip';
import { getAttrSelectOptions, lookupAttrAbbr} from '../../data/character';
import { getLabel } from '../../lib/znzlib';

const SkillRow = styled.div`
    display: flex;
    align-items: center;
    border-bottom: solid 1px ${colors.lightgray};
    
    &:first-of-type{
        border-top: solid 1px ${colors.lightgray};
    }

    .name-wrapper {
        font-size: ${sizes.medium};
        font-weight: 700;
        flex-grow: 1;
        min-width: 5rem;
        margin-right: 2rem;

        input {
            font-size: ${sizes.medium};
            font-weight: 700;
        }
    }

    .select-wrapper {
        select {
            font-size: ${sizes.xSmall};
        }
    }

    .input-wrapper {
        input {
            width: 3rem!important;
            text-align: center;
        }
    }
`;

export function CombatSkill( props ){
    return (
        <SkillRow>
            <div className="name-wrapper">
                <ToolTip text={props.field.tip} bottom={true}>{getLabel(props.field)}</ToolTip>
            </div>
            <div className="select-wrapper">
                {lookupAttrAbbr( props.field.uses)} +
            </div>
            <div className="input-wrapper">
                <NumberInput field={props.field} />
            </div>
        </SkillRow>
    )
}

export function VariableSkill( props ){

    return (
        <SkillRow>
            <div className="name-wrapper">
                <TextInput field={props.label} placeholder={props.placeholder}/>
            </div>
            <div className="select-wrapper">
                <SelectInput options={getAttrSelectOptions()} field={props.uses}/>
            </div>
            <div>
                +
            </div>
            <div className="input-wrapper">
                <NumberInput field={props.value}/>
            </div>
        </SkillRow>
    )
}


export function SkillTable( props ){
    const SkillTableWrapper = styled.div`
    
        h2 {
            text-align: center;
            font-size: ${sizes.large};
        }
    `;

    return (
        <SkillTableWrapper className={props.className}>
            { props.label &&
                <h2>{props.label}</h2>
            }

            {props.children}
        </SkillTableWrapper>
    )
}