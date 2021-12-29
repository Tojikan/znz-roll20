import React from 'react';
import { styled } from '@linaria/react';
import { colors, fonts, sizes } from '../../styles/vars';

// DEPRECATED FOR TOOLTIP

export const TooltipIconStyle = styled.div`
    position: relative;
    border: solid 1px ${colors.focusblue};
    background-color: ${colors.focusblue};
    border-radius: 4rem;
    color: ${colors.white};
    font-size: 1rem;
    cursor: pointer;
    margin: 0 0.5rem;
    display: inline;
    vertical-align: middle;
    justify-content: center;
    align-items: center;
    font-family: ${fonts.helvetica};

    &:hover {
        .tooltiptext {
            visibility: visible;
        }
    }
`;

export const TooltipText = styled.div`
    position: absolute;
    bottom: 100%;
    left: 9rem;
    transform: translateX(-50%);
    z-index: 1;
    visibility: hidden;
    width: 15rem;
    background-color: ${colors.focusblue};
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

export function ToolTip(props){
    return (
        <TooltipIconStyle className="tooltipcontrol">
            ?
            <TooltipText className={`tooltiptext ${props.bottom ? 'bottom' : ''}`}>
                {props.text}
            </TooltipText>
        </TooltipIconStyle>

    )
}