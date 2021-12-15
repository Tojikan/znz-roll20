import React from 'react'
import StatBox from './statbox';
import { Character } from '../../data/character';
import { styled } from '@linaria/react';
import { colors } from '../../styles/vars';
import AmmoBox from './ammobox';
import OptionsBox from './optionsbox';
import LineList from '../inputs/linelist';


export default function StatusBar(){
    const StatusBar = styled.div`
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10.5rem;
        background-color: ${ colors.darkgray};
        border: solid 3px ${ colors.black };
        box-sizing: border-box;
        z-index: 1000;

        .stage {
            display: flex;
            height: 100%;
        }
    `;

    let ammolist = Character.model.ammo.list;
    let options = [
        Character.model.bonusrolls,
        Character.model.rollcost,
    ];
    
    return (
        <StatusBar className="character-status-bar">
            <div className="stage">
                <StatBox stat={Character.model.health}/>
                <StatBox stat={Character.model.sanity}/>
                <StatBox stat={Character.model.fatigue}/>
                <StatBox stat={Character.model.actions}/>
                <AmmoBox list={Object.keys(ammolist).map(x => ammolist[x])} />
                <OptionsBox options={options}/>
            </div>
        </StatusBar>
    )
}