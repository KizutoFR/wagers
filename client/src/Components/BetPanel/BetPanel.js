import axios from 'axios';
import React, {useRef, useState} from 'react';
import { VICTORY_REQUIREMENTS } from '../../utils/config.json'
import BetPanelSwitch from '../BetPanelSwitch/BetPanelSwitch';
import './BetPanel.css';

export default function BetPanel({slug, user_id, setBetList, setBetPanel}) {
  const [list, setList] = useState([]);
  const stake = useRef();

  const addToList = (elem) => {
    let arr = list;
    arr.push(elem);
    setList(arr);
  }

  const removeFromList = (elem) => {
    let arr = list;
    let element_index = list.findIndex(e => e.identifier === elem.identifier);
    if(element_index > -1) {
      arr.splice(element_index, 1);
      setList(arr);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await Promise.all(list.map(el => axios.post(process.env.REACT_APP_API_URL+'/games/requirements/add', el)))
      .then(async res => {
        console.log(res);
        const requirements = res.map(r => r.data.data._id);
        await axios.post(process.env.REACT_APP_API_URL+'/games/bet/add', {
          game_name: slug,
          predefined: false,
          requirements,
          multiplier: 1.5,
          coin_put: Number(stake.current.value),
          user: user_id
        })
        // TODO: Afficher une notif dans les deux cas
        .then(finalbet => {
          setBetList([finalbet.data.data]);
          setBetPanel(false);
          console.log("Bet created successfully")
        })
        .catch(err => console.error(err)) 
      })
  }

  return (
    <div className='betpanel'>
      <form onSubmit={handleSubmit}>
        {VICTORY_REQUIREMENTS.map((vic, index) => (
          <BetPanelSwitch key={index} data={vic} addToList={addToList} removeFromList={removeFromList} needParams={vic.params ? true : false} />
        ))}
        <input type="text" placeholder="Indicate your stake" ref={stake} required />
        <br />
        <input type="submit" value="Confirm bet" />
      </form>
    </div>
  )
}
