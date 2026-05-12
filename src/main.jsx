import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Portfolio from '../NofarPortfolioV2.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Portfolio />
  </StrictMode>,
)
