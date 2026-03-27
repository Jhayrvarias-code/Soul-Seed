import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { GlobalStateProvider } from './context/GlobalStateProvider.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStateProvider>
      <BrowserRouter>
    <App />
    </BrowserRouter>
    </GlobalStateProvider>
    
  </StrictMode>,
)
