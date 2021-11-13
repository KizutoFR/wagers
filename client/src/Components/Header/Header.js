import React from "react";
import './Header.css';

import SearchBar from "../SearchBar/SearchBar";

export default function Header({user_data}) {
  return (
    <div className="container">
      <div className="logo"></div>
      {user_data ? (<SearchBar user_data={user_data} />) : ''}
      <p>Username</p>
    </div>
  )
}