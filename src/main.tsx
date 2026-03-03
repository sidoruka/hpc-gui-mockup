import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { StandaloneView } from './StandaloneView';

const params = new URLSearchParams(window.location.search);
const standalone = params.get('standalone');

const Root = standalone ? StandaloneView : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
