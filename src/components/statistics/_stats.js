import React from 'react'
import { CharacterModel } from '../../data/character';
import { styled } from '@linaria/react';
import { AttributesTable } from './attributes';
import { objToArray } from '../../lib/znzlib';

export default function CharStatistics() {


    const StatsRow = styled.div`
        display: flex;
    `;


    return (
        <StatsRow>
            <AttributesTable attrs={objToArray(CharacterModel.attributes)}></AttributesTable>
        </StatsRow>
    )
}