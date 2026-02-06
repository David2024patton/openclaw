import React from 'react';
import ReactDOM from 'react-dom/client';
import { Dashboard } from './Dashboard';
import './styles.css';

const rootElement = document.getElementById('app-root');

if (!rootElement) {
  throw new Error('Failed to locate root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
