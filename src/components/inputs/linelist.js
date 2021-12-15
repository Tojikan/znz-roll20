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
        margin-right: 0.5rem;
    `;
    
    const Line = styled.div`
        display: flex;
        justify-content: end;

        input {
            border: none;
            border-bottom: ${props => props.underline ? `solid 1px ${colors.black}` : 'none'};
            border-radius: 0;
        }
    `;

    return (
        <List className={`linelist ${props.className}`}>
            {
                props.list.map((x) => {
                    return (
                        <Line className={props.lineClass} key={'line-'+x.key} underline={props.underline}>
                            <Label className={props.labelClass}>{x.label ?? x.key}</Label>
                            <NumberInput field={x}/>
                        </Line>
                    )
                })
            }
        </List>
    )
}