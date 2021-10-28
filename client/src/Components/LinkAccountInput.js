import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './LinkAccountInput.css';

const modifyAccountName = async (accountName, linked_id) => {
    const res = await axios.post(process.env.REACT_APP_API_URL+'/accounts/linked/modify', { name: accountName, linked_id });
    if(res.data.success) {
        //TODO: Afficher une jolie notif avec le message
        console.log(res.data.message)
    } else {
        console.error(res.data.message);
    }
}

const createLinkedAccount = async (modifiedName, account_id, user_id, account_region) => {
    const res = await axios.post(process.env.REACT_APP_API_URL+'/accounts/linked/create', { name: modifiedName, account_id, user_id, account_region });
    if(res.data.success) {
        //TODO: Afficher une jolie notif avec le message
        console.log(res.data.message)
    } else {
        console.error(res.data.message);
    }
}

export default function LinkAccountInput({ data, available, linked_list, user_id }) {
    const [loaded, setLoaded] = useState(false);
    const [accountName, setAccountName] = useState('');
    const [modifiedName, setModifiedName] = useState('');
    const [linkedId, setLinkedId] = useState('');

    const handleSubmit = (e) => {
        if(accountName !== '') {
            modifyAccountName(modifiedName, linkedId);
        } else {
            //TODO: put <select> to choose account_region
            createLinkedAccount(modifiedName, data._id, user_id, 'EUW');
        }
    }

    const handleClick = (e) => {
        window.location.href = `/dashboard/${data.slug}`;
    }

    const stopPropagation = (e) => {
        e.stopPropagation();
    }

    const handleChange = (e) => {
        setModifiedName(e.target.value);
    }

    useEffect(() => {
        if (linked_list && available) {
            let linkedAccount = linked_list.find(elem => elem.account_type.type === data.type);
            if(linkedAccount && !loaded) {
                setLinkedId(linkedAccount._id);
                setAccountName(linkedAccount.username);
                setModifiedName(linkedAccount.username);
                setLoaded(true);
            }
        }
    }, [data.type, linked_list, modifiedName, accountName, loaded, linkedId, available])

    return (
        <div className="game-card" onClick={handleClick}>
            <h5>{data.name}</h5>
            <div className={(available) ? 'inputContainer displayInput' : 'inputContainer'}>
                <input type="text" placeholder="Give your name account" defaultValue={accountName} onChange={handleChange} onClick={stopPropagation} />
                {accountName === modifiedName ? (
                    <button disabled>Ok</button>
                ) : (
                    <button onClick={handleSubmit}>Ok</button>
                )}
            </div>
            <img src={"images/"+data.thumbnail} alt=""/>
        </div>
    );
}