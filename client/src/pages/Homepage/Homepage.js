import React from 'react';
import { Link } from 'react-router-dom';

import './Homepage.css';

export default function Homepage() {
  return (
    <div>
      <h1>Homepage</h1>
      <Link to="/login">Login</Link>
      <br />
      <Link to="/register">Register</Link>
    </div>
  )
}