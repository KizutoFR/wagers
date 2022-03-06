import React from 'react';
import './Challenge.css';

export default function Challenge({challenge}) {

    const getGapUntil = (date) => {
        const date_now = Date.now();
        const date_future = new Date(date);

        var delta = Math.abs(date_future - date_now) / 1000;

        var days = Math.floor(delta / 86400);
        delta -= days * 86400;

        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // var seconds = Math.floor(delta % 60);

        return `${days}j : ${hours}h : ${minutes}m`;
    }

    return (
        <div className="challenge">
            <div className="challenge-thumbnail">
                <div className='challenge-overlay'></div>
                <img src="/images/lol_thumbnail.jpg" />
            </div>
            <div className='challenge-container'>
                <h4>{challenge.name}</h4>
                <p>{challenge.description}</p>
                <div className="challenge-separator"></div>
                <div className='challenge-footer'>
                    <span>{challenge.progress || 0}/{challenge.value}</span>
                    <span className='challenge_date'>{getGapUntil(challenge.end_date)}</span>
                    <span>{challenge.coins}</span>
                </div>
            </div>
        </div>
    )
}