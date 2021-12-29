import React from 'react';
import { styled } from '@linaria/react';
import { colors, fonts, sizes } from '../../styles/vars';


export const ToolTipText = styled.div`
    position: absolute;
    bottom: 100%;
    left: 9rem;
    transform: translateX(-50%);
    z-index: 1;
    visibility: hidden;
    width: 15rem;
    background-color: ${colors.nearblack};
    color: ${colors.white};
    font-size: ${sizes.small};
    text-transform: none;
    padding: 1rem;
    margin-bottom: 5px;
    font-family: ${fonts.helvetica};

    &.bottom {
        top: 100%;
        bottom: initial;
    }
`;

export const ToolTipHover = styled.span`
    text-decoration: underline dotted;
    cursor: pointer;
    position: relative;

    &:hover {
        ${ToolTipText} {
            visibility: visible;
        }
    }
`;


export function ToolTip(props){

    if (props.text){
        return (
            <ToolTipHover className="tooltipcontrol">
                { props.children }
                <ToolTipText className={ `tooltiptext ${props.bottom ? 'bottom' : ''}` }>
                    {props.text}
                </ToolTipText>
            </ToolTipHover>
        )
    } else {
        return props.children
    }
}