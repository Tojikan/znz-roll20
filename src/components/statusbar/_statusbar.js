import React from 'react'
import StatBox from './statbox';
import { CharacterModel } from '../../data/character';
import { styled } from '@linaria/react';
import { colors } from '../../styles/vars';
import AmmoBox from './ammobox';
import OptionsBox from './optionsbox';
import { statusbarVars } from './statusbar-vars';
import { objToArray } from '../../lib/znzlib';



export default function StatusBar(){
    const StatusBar = styled.div`
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: ${ statusbarVars.barheight };
        background-color: ${ colors.darkgray};
        border: solid 3px ${ colors.black };
        box-sizing: border-box;
        z-index: 1000;

        .stage {
            display: flex;
            height: 100%;
        }
    `;

    let ammolist = CharacterModel.ammo.list;
    let options = [
        CharacterModel.bonusrolls,
        CharacterModel.rollcost,
    ];
    
    return (
        <StatusBar className="character-status-bar">
            <div className="stage">
                { objToArray(CharacterModel.resources).map((x,i) => {
                    return (
                        <StatBox stat={x} key={i}/>
                    )
                })}
                <AmmoBox list={Object.keys(ammolist).map(x => ammolist[x])} />
                <OptionsBox options={options}/>
            </div>
        </StatusBar>
    )
}