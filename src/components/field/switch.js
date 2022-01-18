import React from 'react';
import { styled } from '@linaria/react';


/**
 * Hide Adjacent
 * @param {*} props.field 
 * @param {*} props.value value of checkbox
 * @param {*} props.children 
 * @returns 
 */
export function CheckboxSwitch( props ){

    const Container = styled.div`
        display: none;
    `
    const CheckSwitch = styled.div`
        input {
            display: none;

            &:checked {
                & + .switch-container {
                    display: block;
                }
            }
        }

    `
    return (
        <CheckSwitch>
            <input type="checkbox" name={`attr_${ props.field.key }`} value={props.value}/>
            <Container className='switch-container'>
                { props.children }
            </Container>
        </CheckSwitch>
    )
}