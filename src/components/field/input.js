import React from 'react';
import { styled } from '@linaria/react';
import { colors, sizes } from '../../styles/vars';
import { capitalize } from '../../lib/znzlib';



//#region  Basic Number Input 
    export const NumberInputStyle = styled.input`
        transition: 0.3s;
        font-size: 1.6rem;
        border: none;
        border-bottom: ${props => props.underline ? `solid 1px ${colors.black}` : 'none'};

        &:hover {
            background-color: ${colors.lightblue};
        }
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button{
            -webkit-appearance: none; /* Chrome */
            margin: 0; /* Apparently some margin are still there even though it's hidden */
        }
        &[type=number]{
            -moz-appearance:textfield; /* Firefox */
        }
    `;

    export function NumberInput(props){
        return (
            <NumberInputStyle type="number" name={`attr_${props.field.key}${props.max ? '_max': ''}`} defaultValue={props.field.default ?? 0} underline={props.underline} />
        )
    }


    export function LabelledNumberInput(props) {

        const StyleWrapper = styled.div`

        `


        return (
            <StyleWrapper>
                <div>{props.label}</div>
                <NumberInputStyle type="number" name={`attr_${props.field.key}${props.max ? '_max': ''}`} defaultValue={props.field.default ?? 0} underline={props.underline} />
            </StyleWrapper>
        )
    }



//#endregion

//#region  Basic Number Input 
export const TextInputStyle = styled.input`
    transition: 0.3s;
    font-size: 1.6rem;
    border: none;
    border-bottom: ${props => props.underline ? `solid 1px ${colors.black}` : 'none'};
    width: 100%;
    `;

    export function TextInput(props){
    return (
        <TextInputStyle type="text" name={`attr_${props.field.key}`}  underline={props.underline} placeholder={props.placeholder} />
    )
}
//#endregion


//#region Select

    export function SelectInput( props ){
        const SelectStyle = styled.select`
            transition: 0.3s;
            width: 100%;
            font-size: 1.2rem;
            border: none;
            appearance: ${props => props.appearance ? 'auto' : 'none'};
            margin: 0;
            border-bottom: ${props => props.underline ? `solid 1px ${colors.darkgray}` : 'none'};

            &:hover {
                background-color: ${colors.lightblue};
            }
        `;

        return (
            <SelectStyle name={`attr_${props.field.key}`} appearance={props.appearance} underline={props.underline}>
                { props.default  &&
                    <option value={props.default.value}>{props.default.label}</option>
                }
                { props.options.map( (x) => {
                    return (
                        <option value={x.value}>{x.label}</option>
                    )
                })}
            </SelectStyle>
        )
    }


    export function LabelledSelectInput( props ){

        return (
            <div>
                <div>{ props.label }</div>
                <SelectInput field={props.field} 
                            options={props.options}
                            default={props.default}
                            appearance={props.appearance} 
                            underline={props.underline}/>
            </div>
        )
    }

//#endregion