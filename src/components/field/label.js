import React from 'react';
import { styled } from '@linaria/react';
import { sizes } from '../../styles/vars';


export const LabelText = styled.div`
    font-size: ${sizes.medium};
    text-align: right;
    font-weight: 500;
    margin-right: 0.5rem;
`
export const LabelFlexBox = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export function LabelledFlex(props){

    return (
        <LabelFlexBox>
            <LabelText>{ props.label }</LabelText>
            { props.children }
        </LabelFlexBox>
    );
}