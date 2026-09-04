import '@fontsource-variable/vazirmatn'
import './i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { AuthProvider } from './auth/AuthProvider'
import { LanguageProvider } from './i18n/LanguageProvider'
import { ThemeProvider } from './theme/ThemeProvider'
import { router } from './routes/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
