import React from 'react'
import { CharacterModel } from '../../data/character';
import { styled } from '@linaria/react';
import { AttrPool } from './attrpool';

export default function CharStats() {

    const padding = '1'

    const CharStatsWrapper = styled.div`
        display: flex;
        margin-left: -${padding}rem;
        margin-right: ${padding}rem;
        justify-content: space-between;
        width: 100%;
    `;

    const CharPoolWrapper = styled.div`

        padding: 0 ${padding}rem;
    `;

    return (
        <CharStatsWrapper>
                { Object.keys(CharacterModel.attributes).map( (x)=>{
                    return (
                        <CharPoolWrapper>
                            <AttrPool field={CharacterModel.attributes[x]}/>
                        </CharPoolWrapper>
                    )
                })}
        </CharStatsWrapper>
    )
}