import React from 'react';
import { NumberInput } from '../field/input';
import { styled } from '@linaria/react';
import { capitalize } from '../../lib/znzlib';
import { RollButton } from '../field/button';
import { ToolTip } from '../field/tooltip';
import { sizes, colors } from '../../styles/vars';


function Attr( props ) {

    const AttrStyle = styled.div`
        display: flex;
        justify-content: flex-end;
        padding: 0.25rem;
        font-size: ${sizes.large};
        border-right: solid 1px white;

        input {
            width: 4rem!important;
            background-color: ${colors.black};
            color: ${colors.white};
            font-weight: 700;
            text-align: center;

            &:hover {
                color: ${colors.black};
            }
        }

        .attrlabel {
            margin-right: 2rem;
        }


    `;

    return (
        <AttrStyle>
            <div className="attrlabel">
                <ToolTip text={props.field.tip} bottom={true}>
                    {props.field.label ? props.field.label : capitalize(props.field.key)}
                </ToolTip>
            </div>
            <RollButton value='!!zroll'/>
            <NumberInput field={props.field}/>
        </AttrStyle>
    )
}


export function AttributesTable( props ){

    const AttrsContainer = styled.div`
        background-color: ${colors.black};
        color: ${colors.white};
        column-count: 2;
        padding: 1rem 0;
    `


    return (
        <AttrsContainer>
            { props.attrs.map( (x)=>{
                return  (
                    <Attr field={x}></Attr>
                );
            })}
        </AttrsContainer>
    )
}