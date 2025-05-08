import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.tsx'
import SleepToken from './SleepToken.tsx'
import TagManager from 'react-gtm-module'

// ----- GOOGLE ANALYTICS -----
const tagManagerArgs = {
  gtmId: import.meta.env.VITE_GOOGLE_MEASUREMENT_ID
}
TagManager.initialize(tagManagerArgs)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SleepToken />
  </StrictMode>,
)
