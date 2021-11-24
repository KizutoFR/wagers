import React, {useRef, useState} from 'react';
import './BetPanelSwitch.css';

export default function BetPanelSwitch({addToList, removeFromList, data, needParams}) {
  const toggle = useRef();
  const [toggled, setToggled] = useState(false);
  const [value, setValue] = useState('');

  const toggleSwitch = () => {
    if (!needParams || value !== '') {
      if (toggled) {
        removeFromList({identifier: data.identifier, value: !toggled, label: data.label})
      } else {
        addToList({identifier: data.identifier, value: !toggled, label: data.label})
      }
    }
    setToggled(!toggled);
    toggle.current.classList.toggle('toggle');
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    removeFromList({identifier: data.identifier, value: e.target.value, label: data.label})
    if(e.target.value !== '') {
      addToList({identifier: data.identifier, value: e.target.value, label: data.label})
    }
  }

  return (
    <div>
      <div className='switch'>
        <div className="switch-checkbox" onClick={toggleSwitch} ref={toggle}>
          <div className="circle"></div>
        </div>
      <div className="switch-label">{data.label}</div>
      </div>
      {toggled && needParams ? (
        <input type={data.type} placeholder="Enter value for your bet" required name={data.identifier} value={value} onChange={handleChange} />
      ) : ''}
    </div>
  )
}
