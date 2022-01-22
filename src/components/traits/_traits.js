import React from 'react'
import { CharacterModel } from '../../data/character';
import { styled } from '@linaria/react';
import { AbilityBox } from './abilities';
import { FlawBox } from './flaws';
import { affixKey } from '../../lib/znzlib';
import { sizes, fonts, colors } from '../../styles/vars';

export function CharTraits( props ) {

    const TraitsRow = styled.div`
        display: flex;

        h2 {
            text-align: center;
            font-size: ${sizes.xLarge};
            font-family: ${fonts.shadows};
            color: ${colors.bloodred};
        }

        .abilities {
            width: 80%;
        }

    `

    const Row = styled.div`
        display: flex;

        
        .ability-box {
            flex: 1 1 33%;
            width: 33%;
            word-wrap: normal;
        }
        
        @media screen and (max-width: 600px){
            display: block;

            .ability-box {
                width: auto;
            }
        }
        
    `

    let abilityCount = CharacterModel.abilities.count;

    let abilities = [];

    for (let i = 0; i < abilityCount; i++){
        let prefixedAbility = affixKey(null, CharacterModel.abilities.selected, i);
        let prefixedLevel = affixKey(null, CharacterModel.abilities.level, i);

        abilities.push(
            <AbilityBox 
                className="ability-box" 
                level={prefixedLevel} 
                field={prefixedAbility} 
                options={CharacterModel.abilities.options.sort((a,b)=>{
                    if ( a.key < b.key ){
                        return -1;
                      }
                      if ( a.key > b.key ){
                        return 1;
                      }
                      return 0;
                })} 
                key={prefixedAbility.key}
            />
        )

    }


    return (
        <TraitsRow>
            <div className="abilities">
                <Row>{abilities}</Row>
            </div>
            <FlawBox 
                options={CharacterModel.flaws.options.sort((a,b)=>{
                        if ( a.key < b.key ){
                            return -1;
                        }
                        if ( a.key > b.key ){
                            return 1;
                        }
                        return 0;
                    })} 
                    field={CharacterModel.flaws.selected} 
                    count={CharacterModel.flaws.count}
                />
        </TraitsRow>
    )
}



export const TraitBox = styled.div`
    border: solid 2px ${colors.black};
    padding: 0.5rem 1rem;
    margin-right: -2px;

    h2 {
        text-align: center;
    }
`;