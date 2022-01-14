import React from 'react';
import StatusBar from './components/statusbar/_statusbar';
import { CharStatistics } from './components/statistics/_stats';
import { styled } from '@linaria/react';

export default function CharacterSheet(){

    const CharSheet = styled.div`
        font-size: 10px;
        font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
        margin-bottom: 14rem;

        @media (max-width: 760px){
            margin-bottom: 20rem;
        }

        textarea {
            height: 2rem;
        }
    `;

    return (
        <CharSheet className="character-sheet">
            <span>Notes</span>
            <textarea name="attr_char_notes"/>

            <CharStatistics/>

            <StatusBar />
            <script type="text/worker">
            </script>
        </CharSheet>
    )
}