import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppThemeProvider, useAppTheme } from './context/ThemeContext'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { darkTheme, lightTheme } from './theme'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.tsx'

const ThemedApp = () => {
  const { isDark } = useAppTheme();

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme={isDark ? 'dark' : 'light'}
            toastClassName="!bg-transparent !shadow-none !p-0"
          />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <ThemedApp />
    </AppThemeProvider>
  </StrictMode>,
)