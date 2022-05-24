import React from 'react';
import {Chart as Stat} from 'react-chartjs-2';
import Chart from 'chart.js/auto'
import './ProfilContent.css'

export default function ProfilContent() {
    const state = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
        datasets: [
          {
            label: 'Coins',
            fill: false,
            lineTension: 0.5,
            backgroundColor: '#B33CED',
            borderColor: '#F970FE',
            borderWidth: 3,
            data: [65, 59, 160, 56, 52, 0, 0, 0, 0, 0, 0, 0]
            
          }
        ]
      }

    return (
        <>
            <div className="profile-separator">
                <h3>STATISTICS</h3>
                <div className="separator"></div>
            </div>
            <div className="stats">
                <div className="statsgauche">
                    <div className="statsgauchehaut">
                        <div className="statsgauchehaut1">
                            <div className="statsgauchehaut1rond">
                                <h3>65<span>%</span></h3>
                                <h4>de victoire </h4>
                                <div className="statsgauchehaut1carré"></div>
                                </div>
                        </div>

                    </div>
                    <div className="statsgauchebas">
                        <img className="imggauchebas" src="/images/vague2.svg"/>
                        <div className="statsgauchebas1">
                            <img src="/images/award.svg"/>
                            <div className="statsgauchebas2">
                                <h2>100</h2>
                                <p>Total Wins</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="statsdroit">
                    <h3>Balance Evolution</h3>
                    <div className='graph'>
                        <Stat 
                            type="line"
                            data={state}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="profile-separator">
                <h3>BET HISTORY</h3>
                <div className="separator"></div>
            </div>
            <div className="bethistory"> 
                <table cellSpacing="0" cellPadding="0">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Game</th>
                        <th>Stack</th>
                        <th>Multiplier</th>
                        <th>Stats</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>09/02/2022</td>
                        <td>League of Legends</td>
                        <td>700</td>
                        <td>x1.5</td>
                        <td>Win</td>
                    </tr>
                    <tr className="loose">
                        <td>09/02/2022</td>
                        <td>League of Legends</td>
                        <td>750</td>
                        <td>x1.75</td>
                        <td>Loose</td>
                    </tr>
                    <tr className="loose">
                        <td>09/02/2022</td>
                        <td>League of Legends</td>
                        <td>750</td>
                        <td>x1.75</td>
                        <td>Loose</td>
                    </tr>
                    <tr>
                        <td>09/02/2022</td>
                        <td>League of Legends</td>
                        <td>700</td>
                        <td>x1.5</td>
                        <td>Win</td>
                    </tr>
                </tbody>
                </table>
                
            </div>
        </>
    )
}