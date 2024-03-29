import React from 'react';
import StatusBar from './components/statusbar/_statusbar';
import { CharStatistics } from './components/statistics/_stats';
import { styled } from '@linaria/react';
import { CharTraits } from './components/traits/_traits';
import { EquipmentSlots } from './components/items/_equipped';
import { Inventory } from './components/items/_inventory';
import StatBox from './components/statusbar/statbox';

export default function CharacterSheet(){

    const CharSheet = styled.div`
        font-size: 10px;
        font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
        margin-bottom: 14rem;

        @media (max-width: 760px){
            margin-bottom: 20rem;
        }

        > textarea {
            height: 2rem;
        }
    `;

    const Layout = styled.div`
        display: flex;
    `

    const Sidebar = styled.div`
        width: 25%;
        min-width: 190px;
        margin-right: 2rem;
    `

    const Mainbar = styled.div`
        width: 75%;
    `

    

    return (
        <CharSheet className="character-sheet">
            <span>Notes</span>
            <textarea name="attr_char_notes"/>
            <Layout>
                <Sidebar>
                    <CharStatistics/>
                </Sidebar>
                <Mainbar>
                    <CharTraits/>
                    <EquipmentSlots />
                </Mainbar>
            </Layout>
            <Inventory />
            <StatusBar />
            <script type="text/worker">
            </script>
        </CharSheet>
    )
}