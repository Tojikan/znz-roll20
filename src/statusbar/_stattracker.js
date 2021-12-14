import React from 'react'
import NumberInput from '../inputs/numberinput'


export default function StatTracker(props){

    return (
        <div className={`stat-tracker box ${props.stat.id}`}>
            <div class="stat-label label-text">
                { props.stat.label ?? props.stat.id.charAt(0).toUpperCase() + props.stat.id.slice(1)}
                { props.stat.action ? <button type='action' name={props.stat.action}>{props.stat.actionLabel ?? ''}</button> : ''}
            </div>
            <div class="stat-wrapper">
                <div class="main">
                    <NumberInput id={props.stat.id} />
                </div>
                { props.stat.max ? <div class="sub">Max: <NumberInput id={props.stat.id} max={true}/></div> : ''}
            </div>
        </div>
    )
}