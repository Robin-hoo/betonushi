import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback="loading">
      <AuthProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </AuthProvider>
    </Suspense>
  </StrictMode>,
)
