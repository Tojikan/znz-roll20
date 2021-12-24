import React from 'react';
import { styled } from '@linaria/react';
import { AttributeStat, AttrStatStyle } from './attribute';
import { PoolStat } from './pool';


export function AttrPool(props){

    const AttrPoolStyle = styled.div`
        margin-bottom: 2rem;

        ${AttrStatStyle} {
            margin-left: 6.8rem;
        }

        .attr-container {
            margin-top: -1rem;
        }
    `

    return (
        <AttrPoolStyle>
            <PoolStat field={props.field} label={props.label}/>
            <div className='attr-container'>
                { Object.keys(props.field.attr).map( (a)=>{
                    let obj = props.field.attr[a];
                    return (
                        <AttributeStat field={obj} key={obj.key}/>
                    )
                })}
            </div>
        </AttrPoolStyle>
    )
}
