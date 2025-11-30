import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// @ts-ignore
import './unimark-element.js';

const rootElement = document.getElementById('root');

// Only attempt to mount React if the root element exists.
// This prevents the "Could not find root element" error when running in Custom Element only mode.
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.log('UniMark: Running in Custom Element mode. React app not mounted.');
}