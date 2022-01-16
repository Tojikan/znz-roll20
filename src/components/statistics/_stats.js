import React from 'react'
import { CharacterModel } from '../../data/character';
import { styled } from '@linaria/react';
import { AttributesTable } from './attributes';
import { objToArray, suffixKey } from '../../lib/znzlib';
import { SkillTable, CombatSkill, VariableSkill } from './skills';
import { colors } from '../../styles/vars';

export function CharStatistics( props ) {


    const StatsRow = styled.div`
        /* display: flex;
        justify-content: space-between; */

        .skill-table {
            flex-basis: 40%;
            /* margin-left: 3rem; */

            border-left: solid 1px ${colors.lightgray};
            border-right: solid 1px ${colors.lightgray};
            padding: 1rem;

            &:last-of-type {
                border-bottom: solid 1px ${colors.lightgray};
            }
        }

        .attr-table {
            flex-basis: 30%;
        }
    `;


    //prefix and setup variable skills
    let varSkillsCount = CharacterModel.skills.count;
    let varSkills = [];

    //1-indexed so we can refer to things as 1,2,3
    for (let i = 1; i <= varSkillsCount; i++){
        let prefixedVal = suffixKey(CharacterModel.skills.value, i);
        let prefixedLabel = suffixKey(CharacterModel.skills.label, i);
        let prefixedUses = suffixKey(CharacterModel.skills.uses, i);
        let placeholder = "";

        if (i == 1){
            placeholder = "Enter Skill Name";
        }

        varSkills.push(
            <VariableSkill value={prefixedVal} label={prefixedLabel} uses={prefixedUses} placeholder={placeholder}></VariableSkill>
        )
    }

    let combatSkills = objToArray(CharacterModel.combatskills).map((x)=>{
        return (
            <CombatSkill field={x}/>
        )
    });


    return (
        <StatsRow>
            <AttributesTable className="attr-table" attrs={objToArray(CharacterModel.attributes)}></AttributesTable>
            <SkillTable className="skill-table" label="Combat Bonuses">
                { combatSkills }
            </SkillTable>
            <SkillTable className="skill-table" label="Skill Bonuses">
                { varSkills }
            </SkillTable>
        </StatsRow>
    )
}