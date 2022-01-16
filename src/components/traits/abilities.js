import React from 'react';
import { styled } from '@linaria/react';
import { LabelledNumberInput, LabelledSelectInput } from '../field/input';
import { colors } from '../../styles/vars';
import { CheckboxSwitch } from '../field/switch';


export function AbilityBox( props ) {

    const Box = styled.div`
        border: solid 2px ${colors.black};
        padding: 0.3rem;


        &:not(:last-child){
            border-right: none;
        }

        .level-line {
            margin-bottom: 1rem;
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
        <Box className={props.className}>
            <Row>
                <LabelledSelectInput field={props.field} label="Ability" options={props.options} appearance={true} underline={true} default={{label:"", value:""}}/>
                <LabelledNumberInput field={props.level} label="Level"/>
            </Row>
                {props.options.map(s => {   
                    return (
                        <CheckboxSwitch field={props.field} value={s.key}>
                            <div className="level-line"><strong>Lvl 1: </strong>{s.lvl1}</div>
                            <div className="level-line"><strong>Lvl 2: </strong>{s.lvl2}</div>
                            <div className="level-line"><strong>Lvl 3: </strong>{s.lvl3}</div>
                        </CheckboxSwitch>
                    )
                })}
        </Box>
    )
}