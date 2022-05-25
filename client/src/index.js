import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthProvider } from "./context/Auth";
import { BrowserRouter } from 'react-router-dom';
import './i18n';

ReactDOM.render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>,
  document.getElementById('root')
);
