import React from 'react';
import { styled } from '@linaria/react';
import { LabelledNumberInput, LabelledSelectInput } from '../field/input';
import { colors } from '../../styles/vars';
import { CheckboxSwitch } from '../field/switch';
import { ToolTip } from '../field/tooltip';
import { TraitBox } from './_traits';


export function AbilityBox( props ) {

    const AbilityBox = styled(TraitBox)`
        .level-line {
            margin-bottom: 1rem;

            .level-label {
                font-weight: 700;
                text-decoration: underline;
            }
        }
    `

    const Row = styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;

        select {
            margin-right: 2rem;
        }

        input {
            max-width: 2rem!important;
            text-align: center;
        }
    `


    return (
        <AbilityBox className={props.className}>
            <Row>
                <LabelledSelectInput field={props.field} label="Ability" options={props.options} appearance={true} underline={true} default={{label:"", value:""}}/>
                <LabelledNumberInput field={props.level} label="Level"/>
            </Row>
                {props.options.map(s => {   
                    return (
                        <CheckboxSwitch field={props.field} value={s.key} key={s.key}>
                            {s.levels.map((x, i) => {
                                return (
                                    <div className="level-line"  key={i}>
                                        <span className="level-label">Lvl {i + 1}</span>  -&nbsp;&nbsp;&nbsp; 
                                        <ToolTip text={x.tip}>
                                            {x.label}
                                        </ToolTip>
                                    </div>
                                )
                            })}
                        </CheckboxSwitch>
                    )
                })}
        </AbilityBox>
    )
}