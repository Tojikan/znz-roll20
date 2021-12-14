import React from 'react'
import StatTracker from './_stattracker';








export default function StatusBar(){
    const health = {id: 'health', default: 100, max: true};
    const fatigue = {id: 'fatigue'};
    const trauma = {id: 'trauma'};
    const actions = {id: 'actions', max: true, action: 'refreshAP', actionlabel: 'refresh'};
    
    return (
        <div className="character-status-bar">
            <div class="stage">
                <StatTracker stat={health}/>
                <StatTracker stat={fatigue}/>
                <StatTracker stat={trauma}/>
                <StatTracker stat={actions}/>
            </div>
        </div>
    )
}