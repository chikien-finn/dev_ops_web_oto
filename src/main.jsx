import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { CarProvider } from './context/CarContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CarProvider>
        <App />
      </CarProvider>
    </AuthProvider>
  </StrictMode>,
)
