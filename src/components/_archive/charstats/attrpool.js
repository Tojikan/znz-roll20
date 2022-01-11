import React from 'react';
import { styled } from '@linaria/react';
import { Attribute, AttributeStyle } from './attribute';
import { PoolStat } from './pool';
import { getLabel } from '../../lib/znzlib';


export function AttrPool(props){

    const AttrPoolStyle = styled.div`
        margin-bottom: 2rem;

        ${AttributeStyle} {
            margin-left: 6.8rem;
        }

        .attr-container {
            margin-top: -1rem;
        }
    `

    let label = (props.label) ? props.label : getLabel(props.field);

    return (
        <AttrPoolStyle>
            <PoolStat field={props.field} label={label}/>
            <div className='attr-container'>
                { Object.keys(props.field.list).sort().map( (a)=>{
                    let obj = props.field.list[a];
                    return (
                        <Attribute field={obj} key={obj.key}/>
                    )
                })}
            </div>
        </AttrPoolStyle>
    )
}
