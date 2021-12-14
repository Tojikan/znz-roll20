import React from 'react';
import StatusBar from './components/statusbar/statusbar';
import { styled } from '@linaria/react';

export default function CharacterSheet(){

    const CharSheet = styled.div`
        font-size: 10px;
        font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
        margin-bottom: 14rem;

        @media (max-width: 760px){
            margin-bottom: 20rem;
        }
    `;


    return (
        <CharSheet class="character-sheet">
            <StatusBar />
            <script type="text/worker">
            </script>
        </CharSheet>
    )
}