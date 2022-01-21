import React from 'react';
import { styled } from '@linaria/react';
import { NumberInput } from '../field/input';
import { capitalize } from '../../lib/znzlib';
import { RollButton } from '../field/button';
import { ToolTip } from '../field/tooltip';
import { sizes, colors } from '../../styles/vars';
import { GenerateAttrRoll } from '../../scripts/attrRoll';


function Attr( props ) {

    const AttrStyle = styled.div`
        display: flex;
        justify-content: flex-end;
        padding: 0.25rem;
        font-size: ${sizes.large};

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
            display: flex;
            flex-grow: 1;
            padding: 0 1rem;
        }


    `;

    return (
        <AttrStyle>
            <div className="attrlabel">
                <ToolTip text={props.field.tip} bottom={true}>
                    {props.field.label ? props.field.label : capitalize(props.field.key)}
                </ToolTip>
            </div>
            <RollButton value={GenerateAttrRoll(props.field.key, capitalize(props.field.key))}/>
            <NumberInput field={props.field}/>
        </AttrStyle>
    )
}


export function AttributesTable( props ){

    const AttrsContainer = styled.div`
        background-color: ${colors.black};
        color: ${colors.white};
        padding: 1rem 0;
    `


    return (
        <AttrsContainer className={props.className}>
            { props.attrs.map( (x, i)=>{
                return  (
                    <Attr field={x} key={`attr-${i}`}></Attr>
                );
            })}
        </AttrsContainer>
    )
}