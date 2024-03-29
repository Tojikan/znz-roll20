import React from 'react';
import { styled } from '@linaria/react';
import { colors, sizes } from '../../styles/vars';
import { capitalize, getLabel } from '../../lib/znzlib';



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

    /**
     * @param {field} props.field 
     * @param {boolean} props.max
     * @param {boolean} props.underline
     * @returns 
     */
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

    export function DividerLine(props){
        const Line = styled.span`
            font-size: 2rem;
            font-weight: 700;
            margin: 0 0.2rem;
        `

        return (
            <Line>/</Line>
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
    color: ${colors.black};
    
    &::placeholder {
        color: ${colors.lightgray};
    }
`;


/**
 * @param {field} props.field
 * @param {boolean} props.underline
 * @param {string} props.placeholder
 * @returns 
 */
export function TextInput(props){
    return (
        <TextInputStyle type="text" name={`attr_${props.field.key}`}  underline={props.underline} placeholder={props.placeholder} />
    )
}
//#endregion


//#region Select
    /**
     * @param {array} props.options [{key, label}]
     * @param {field} props.field
     * @param {object} props.default  {key, label}
     * @param {boolean} props.appearance 
     * @param {boolean} props.underline 
     * @param {boolean} props.disabled 
     * @returns 
     */
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
            <SelectStyle name={`attr_${props.field.key}`} appearance={props.appearance} underline={props.underline} disabled={props.disabled}>
                { props.default  &&
                    <option value={props.default.key}>{props.default.label}</option>
                }
                { props.options.map( (x,i) => {
                    return (
                        <option key={i} value={x.key}>{getLabel(x)}</option>
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


//#region Toggle
export function ToggleInput( props ){
    const ToggleRow = styled.div`
        display: flex;
        text-align: center;

        .toggle-control {
            margin-right: 0.5rem;
            position: relative;
        }
    `
    const RadioButtonLabel = styled.div`
        background-color: ${colors.lightred};
        padding: 0.2rem 0.6rem;
        font-size: 1.4rem;
        border: solid 1px black;
        border-radius: 0.6rem;
        background-color: ${colors.lightgray};
    `;

    const RadioButton = styled.input`
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 20;
        width: 100%!important;
        height: 100%!important;
        text-align: center;

        &:checked + .toggle-label {
            background-color: ${colors.lightred};
            color: ${colors.white}
        }
    `



    return (
        <ToggleRow>
            { props.field.options.map((x, i) =>{
                return (
                    <div className="toggle-control" key={x}>
                        <RadioButton type="radio" name={`attr_${props.field.key}`} value={x} checked={i == 0 ? 'checked' : ''} onChange={()=>{} /* onchange for resolving console error */}/>
                        <RadioButtonLabel className="toggle-label">{capitalize(x)}</RadioButtonLabel>
                    </div>
                )
            })}
        </ToggleRow>
    )
}
//#endregion    


//#region Hidden
/**
 * @param {field} props.field
 * @param {string} props.value - optional
 * @param {string} props.type
 * @param {string} props.checked - 'checked'
 * @returns 
 */
export function HiddenInput( props ){

    let proptype = ( props.type ? props.type : 'checkbox');

    const InputStyle = styled.input`
        display: none;
    `;

    if (props.value ){
        return (
            <InputStyle className={props.className} type={proptype} name={`attr_${props.field.key}`} value={props.value} defaultChecked={props.checked}/>
        )
    }

    return (
        <InputStyle className={props.className} type={proptype} name={`attr_${props.field.key}`} defaultChecked={props.checked}/>
    )
}

//#endregion    


//#region TextArea
    /**
     * @param {field} props.field
     * @returns 
     */
export function TextAreaInput( props ){

    const TextArea = styled.textarea`
        width: 100%;
        box-sizing: border-box;
    `;


    return (
        <TextArea className={props.className} name={`attr_${props.field.key}`}></TextArea>
    )
}

//#endregion    



export function ReadOnly(props) {

    const SpanStyle = styled.span`
        text-transform: capitalize;
    `

    return (
        <SpanStyle name={`attr_${props.field.key}`}></SpanStyle>
    )
}