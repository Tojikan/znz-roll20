import React from 'react';
import { styled } from '@linaria/react';
import { colors, fonts, sizes } from '../../styles/vars';


export const ToolTipIcon = styled.div`
    position: relative;
    border: solid 1px ${colors.focusblue};
    background-color: ${colors.focusblue};
    border-radius: 4rem;
    color: ${colors.white};
    font-size: 1rem;
    cursor: pointer;
    margin: 0 0.5rem;
    font-family: ${fonts.helvetica};
    min-width: 1.5rem;
    text-align: center;
`


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

    &.left {
        left: -7rem
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

/**
 * Displays markup that shows text on hover
 * @param {*} props.children HTML control to hover over to display the ToolTip text
 * @param {*} props.text Text to display when hovered
 * @param {*} props.bottom Text displays under or above the control element
 * @returns 
 */
export function ToolTip(props){

    if (props.text){
        return (
            <ToolTipHover className="tooltipcontrol">
                { props.children }
                <ToolTipText className={ `tooltiptext ${props.bottom ? 'bottom' : ''} ${props.left ? 'left' : ''}` }>
                    {props.text}
                </ToolTipText>
            </ToolTipHover>
        )
    } else {
        return props.children
    }
}

/**
 * Like ToolTip but children is the text
 * @param {*} props 
 */
export function ToolTip2(props) {
    if (props.trigger){
        return (
            <ToolTipHover className="tooltipcontrol">
                {props.trigger}
                <ToolTipText className={ `tooltiptext ${props.bottom ? 'bottom' : ''} ${props.left ? 'left' : ''}` }>
                    { props.children }
                </ToolTipText>
            </ToolTipHover>
        )
    } else {
        return props.children
    }
}