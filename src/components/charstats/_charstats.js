import React from 'react'
import { CharacterModel } from '../../data/character';
import { styled } from '@linaria/react';
import { AttrPool } from './attrpool';

export default function CharStats() {
    const CharStatsWrapper = styled.div``;

    return (
        <CharStatsWrapper>
            <AttrPool field={CharacterModel.body} label="Body"/>
            <AttrPool field={CharacterModel.mind} label="Mind"/>
        </CharStatsWrapper>
    )
}