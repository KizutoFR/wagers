import React, {useEffect, useState} from 'react';
import './LinkAccountInput.css';

export default function LinkAccountInput({ data, available, linked_list }) {
    const [pressed, setPressed] = useState();
    const [accountName, setAccountName] = useState();

    const handleClick = (e) => {
        setPressed(!pressed);
    }

    const stopPropagation = (e) => {
        e.stopPropagation();
    }

    useEffect(() => {
        if (linked_list) {
            let linkedAccount = linked_list.find(elem => elem.account_type.type === data.type);
            if(linkedAccount) {
                setAccountName(linkedAccount.username)
            }
        }
    }, [data.type, linked_list, accountName])

    return (
        <div className="game-card" onClick={handleClick}>
            <h5>{data.name}</h5>
            { !available ? <p>Coming soon</p> : null }
            <div>
                { available && pressed ? (
                    <div className="inputContainer">
                        <input type="text" ref={accountName} placeholder="Give your name account" value={accountName} onChange={setAccountName} onClick={stopPropagation} />
                        <button>Ok</button>
                    </div>
                ) : null }
            </div>
            <img src={"images/"+data.thumbnail} alt=""/>
        </div>
    );
}