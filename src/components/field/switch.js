import React from 'react';
import { styled } from '@linaria/react';



export function CheckboxSwitch( props ){

    const Container = styled.div`
        display: none;
    `
    const CheckSwitch = styled.div`
        input {
            display: none;

            &:checked {
                display: none;
                & + .switch-container {
                    display: block;
                }
            }
        }

    `


    return (
        <CheckSwitch>
            <input type="checkbox" name={`attr_${ props.field.key } `} />
            <Container className='switch-container'>
                { props.children }
            </Container>
        </CheckSwitch>
    )
}