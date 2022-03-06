import React, {useRef, useEffect, useState} from 'react';
import './CurrentBet.css';

export default function CurrentBet({current_bet, verifyBetWin}) {
    const bet_element = useRef();
    const [circleNumber, setCircleNumber] = useState(0);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        const circleSize = 40;
        setCircleNumber(Math.ceil(bet_element.current.offsetHeight / circleSize));
    }, [bet_element, current_bet])

    const verifyBet = async () => {
        setVerifying(true);
        await verifyBetWin();
        setVerifying(false);
    }

    return (
        <div className='dashboard-bet' ref={bet_element}>
            {current_bet ? (
                <div>
                    <div className='dashboard-bet-left'>
                        <div className='left-header'>
                            <img src="images/logo.svg" alt="logo" />
                            <span></span>
                        </div>
                        <div className='left-content'>
                            <div>
                                <p>Your stake: <span>{current_bet.coin_put}<img src="images/PIEPECES.svg" /></span></p>
                                <p>Multiplier: <span>x{current_bet.multiplier}</span></p>
                            </div>
                            <p>Potential gain: <span>{current_bet.coin_put * current_bet.multiplier}<img src="images/PIEPECES.svg" /></span></p>
                        </div>
                        {!verifying ? <button onClick={verifyBet}>VERIFY BET</button> : <button>VERIFYING...</button>}
                    </div>
                    <div className='dashboard-bet-right'>
                        <div className='code-barre'></div>
                        <div className='requirements-grid'>
                            {current_bet.requirements.map((requirement, index) => (
                                <div className='requirement-item' key={index}>
                                    <div className='requirement-content'>
                                        <img src={requirement.figure} alt={requirement.identifier} />
                                    </div>
                                    <div className='requirement-footer'>
                                        <img src="images/blop.svg"  alt="svg form" />
                                        <p>{requirement.value === true ? 'Yes' : requirement.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='ticket-edge'>
                        {Array.from(Array(circleNumber)).map((elem, index) => (
                            <span key={index}></span>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='no-bet'>no bet</div>
            )}
        </div>
    )
}