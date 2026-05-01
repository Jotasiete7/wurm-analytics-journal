import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx'

import { LayoutBase } from '@antigravity/layout/LayoutBase'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <LayoutBase>
          <App />
        </LayoutBase>
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>,
)
