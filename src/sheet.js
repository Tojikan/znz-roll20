import React from 'react'
import StatusBar from './components/statusbar/statusbar'

export default function CharacterSheet(){
    return (
        <div class="character-sheet">
            <StatusBar />
            <script type="text/worker">
            </script>
        </div>
    )
}