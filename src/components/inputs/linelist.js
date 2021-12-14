import React from 'react';
import { styled } from '@linaria/react';
import { colors, sizes } from '../../styles/vars';
import NumberInput from './numberinput';




export default function LineList(props){
    const List = styled.div`
        
    `;
    
    const Label = styled.div`
        font-size: ${sizes.medium};
        text-align: right;
        display: flex;
        flex-direction: column;
        justify-content: end;
        font-weight: 500;
        `;
    
    const Line = styled.div`
        display: flex;
        justify-content: space-between;

        input {
            border: none;
            border-bottom: solid 1px ${colors.darkgray};
            border-radius: 0;
        }
    `;

    return (
        <List className='linelist'>
            {
                props.list.map((x) => {
                    return (
                        <Line key={'line-'+x.key}>
                            <Label>{x.label ?? x.key}</Label>
                            <NumberInput field={x}/>
                        </Line>
                    )
                })
            }
        </List>
    )
}