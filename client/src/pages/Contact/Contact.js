import React, { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import './Contact.css';


export default function Contact() {
  const [errorMessage, setErrorMessage] = useState('');
  const [messageSubject,setMessageSubject] = useState('');

  const handleRequirementSelection = (event) => {
    setMessageSubject(event.target.value)
  }


  return (
    <div className="contact-container">
      <div className="form-contact-container">
        <form>
        <div className="contact-select">
            <FaCaretDown className='icon' />
            <select onChange={handleRequirementSelection}>
              <option value="0">Select an option</option>
              <option value="probleme-coins">Problème Monnaie</option>
              <option value="bet-result-contest">Contester le résultat d'un pari</option>
              <option value="litiges">Litiges</option>
              <option value="bug-report">Rapporter un bug</option>
              <option value="Autres">Autres</option>
            </select>
        </div>
          <div className="text-ticket">
            <textarea className="ticket-message" rows="20" type="text" placeholder="Partagez votre requête" />
          </div>
          <div className="request-button">
             <button data-action="submit">Envoyer requête</button>
          </div>
        </form>
      </div>
      <div className="contact-video-container">
        <div className='gradient'></div>
        <video autoPlay loop muted>
          <source src='/videos/leagues.mp4' type="video/mp4" />
        </video>
      </div>
    </div>
  )
  }