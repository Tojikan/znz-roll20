import React from 'react';
import { styled } from '@linaria/react';


export default function Box(props){

    const Box = styled.div`
        min-width: 10rem;
        border: solid 2px;
        border-color: #727274 #262626 #262626 #727274;
        padding: 0.5rem;
        padding-top: 0;
    `;


    return (
        <Box>
            { props.children }
        </Box>
    )
}