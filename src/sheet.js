import React from 'react';
import StatusBar from './components/statusbar/_statusbar';
import CharStats from './components/charstats/_charstats';
import { styled } from '@linaria/react';

export default function CharacterSheet(){

    const CharSheet = styled.div`
        font-size: 10px;
        font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
        margin-bottom: 14rem;
        display: flex;

        @media (max-width: 760px){
            margin-bottom: 20rem;
        }
    `;

    const Sidebar = styled.div`
        width: 30%;
    `

    const Main = styled.div`
        flex-grow: 1;
    `


    return (
        <CharSheet class="character-sheet">
            <Sidebar>
                <CharStats />
            </Sidebar>
            <StatusBar />
            <script type="text/worker">
            </script>
        </CharSheet>
    )
}