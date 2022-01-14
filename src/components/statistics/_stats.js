import React from 'react'
import { CharacterModel } from '../../data/character';
import { styled } from '@linaria/react';
import { AttributesTable } from './attributes';
import { objToArray, prefixKey } from '../../lib/znzlib';
import { SkillTable, CombatSkill, VariableSkill } from './skills';

export function CharStatistics( props ) {


    const StatsRow = styled.div`
        display: flex;
        justify-content: space-between;

        .skill-table {
            flex-basis: 40%;
            margin-left: 3rem;
        }

        .attr-table {
            flex-basis: 30%;
        }
    `;

    let varSkillsCount = 6;
    let varSkills = [];

    for (let i = 1; i <= varSkillsCount; i++){
        let prefixedVal = prefixKey(CharacterModel.skills.value, i);
        let prefixedLabel = prefixKey(CharacterModel.skills.label, i);
        let prefixedUses = prefixKey(CharacterModel.skills.uses, i);
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
            <SkillTable className="skill-table" label="Combat Skills">
                { combatSkills }
            </SkillTable>
            <SkillTable className="skill-table" label="Skills">
                { varSkills }
            </SkillTable>
        </StatsRow>
    )
}