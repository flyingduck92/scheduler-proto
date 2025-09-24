import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import the Syncfusion license registration function
import { registerLicense } from '@syncfusion/ej2-base'

// Register the license using the environment variable
registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
