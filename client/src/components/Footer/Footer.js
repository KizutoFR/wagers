import React, { useEffect, useState } from "react";

import './Footer.css';


export default function Footer() {
  return (
    <div className="footer-container">
        <div className="footer">
            <div className="footer-col">
                <h3>INFORMARTIONS</h3>
                <ul>
                    <li><a href="">Mentions légales</a></li>
                    <li><a href="">Cookies</a></li>
                    <li><a href="">FAQ</a></li>
                </ul>
            </div>
            <div className="footer-col">
                <h3>PLAN DU SITE</h3>
                 <ul>
                    <li><a href="">Comment ça marche ?</a></li>
                    <li><a href="">Recompenses</a></li>
                    <li><a href="">Contact</a></li>
                </ul> 
            </div>
            <div className="footer-col">
                <h3>RESEAUX SOCIAUX</h3>
                 <ul>
                    <li><a href="https://www.facebook.com/WagersOff">Facebook</a></li>
                    <li><a href="https://www.instagram.com/wagers_off/">Instagram</a></li>
                    <li><a href="https://twitter.com/Wagers_Off">Twitter</a></li>
                </ul> 
                
            </div>
        </div>
        <div className="footer-logo">
            <img src ="images\logo.svg"></img>
        </div>
    </div>
    
  )
}