// ============================================
// Ana Giriş Noktası
// React uygulamasını DOM'a bağlar
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { YetkilendirmeSaglayici } from './context/YetkilendirmeBaglami';
import './index.css';

// Uygulamayı başlat
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <YetkilendirmeSaglayici>
        <App />
      </YetkilendirmeSaglayici>
    </BrowserRouter>
  </React.StrictMode>
);
