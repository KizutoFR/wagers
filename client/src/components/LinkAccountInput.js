import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './LinkAccountInput.css';
import Swal from 'sweetalert2'
import { headers } from '../utils/config';


export default function LinkAccountInput({ data, available, linked_list, user_id }) {
    const [loaded, setLoaded] = useState(false);
    const [accountName, setAccountName] = useState('');
    const [modifiedName, setModifiedName] = useState('');
    const [linkedId, setLinkedId] = useState('');


    const stopPropagation = (e) => {
        e.stopPropagation();
    }

    const handleChange = (e) => {
        setModifiedName(e.target.value);
    }

    const linkedGameAccount = async () =>{
        let res;
        if(accountName !== '') {
            //TODO: put <select> to choose account_region
            // modifyAccountName(modifiedName, linkedId, 'EUW');
            res = await axios.post(process.env.REACT_APP_API_URL+'/accounts/linked/modify', { name: modifiedName, linked_id:linkedId, account_region:'EUW' }, headers);

        } else {
            //TODO: put <select> to choose account_region
            // createLinkedAccount(modifiedName, data._id, user_id, 'EUW');
            res = await axios.post(process.env.REACT_APP_API_URL+'/accounts/linked/create', { name: modifiedName, account_id:data._id, user_id, account_region:'EUW' }, headers);

        }
        if(res.data.success) {
            //TODO: Afficher une jolie notif avec le message
            Swal.fire({
                title: 'Account linked successfully !',
                text: `${modifiedName} is now your account linked for one month`,
                icon: 'success',
                confirmButtonText: 'Ok'
              })
        } else {
            console.error(res.data.message);
        }
    }

    useEffect(() => {
        if (linked_list && available) {
            let linkedAccount = linked_list.find(elem => {               
                return elem.account_type.type === data.type;
            });
            if(linkedAccount && !loaded) {
                setLinkedId(linkedAccount._id);
                setAccountName(linkedAccount.username);
                setModifiedName(linkedAccount.username);
                setLoaded(true);
            }
        }
    }, [data.type, linked_list, modifiedName, accountName, loaded, linkedId, available])

    return (
        <div className="game-card">
            {/* <h5>{data.name}</h5> */}
           
            <figure>
                <img src={"images/"+data.thumbnail} alt="thumb"/>
            </figure>
            
            <div className={(available) ? 'inputContainer displayInput' : 'inputContainer'}>
                <input type="text" placeholder="Give your name account" defaultValue={accountName} onChange={handleChange} onClick={stopPropagation} />
                {accountName === modifiedName ? (
                    <button disabled onClick={stopPropagation}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                           <path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/>
                        </svg> 
                    </button>
                ) : (
                    <button onClick={linkedGameAccount}>
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                           <path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/>
                        </svg>    
                    </button>
                )}
            </div>
        </div>
    );
}