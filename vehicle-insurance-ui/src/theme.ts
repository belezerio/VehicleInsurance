import { createTheme } from '@mui/material/styles';

const glassBackground = 'rgba(255, 255, 255, 0.03)';
const glassBorder = '1px solid rgba(255, 255, 255, 0.08)';
const glassBlur = 'blur(16px)';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // indigo-500
      light: '#818cf8', // indigo-400
      dark: '#4f46e5', // indigo-600
    },
    secondary: {
      main: '#ec4899', // pink-500
      light: '#f472b6', // pink-400
      dark: '#db2777', // pink-600
    },
    background: {
      default: '#020617', // slate-950
      paper: glassBackground,
    },
    success: {
      main: '#10b981', // emerald-500
    },
    warning: {
      main: '#f59e0b', // amber-500
    },
    info: {
      main: '#3b82f6', // blue-500
    },
    error: {
      main: '#ef4444', // red-500
    },
    text: {
      primary: '#f8fafc', // slate-50
      secondary: '#94a3b8', // slate-400
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #020617 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: glassBackground,
          backdropFilter: glassBlur,
          border: glassBorder,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: glassBackground,
          backdropFilter: glassBlur,
          border: glassBorder,
          overflow: 'hidden',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            boxShadow: '0 12px 48px 0 rgba(99, 102, 241, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
            color: '#ffffff',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.23)',
              transform: 'translateY(-2px)',
            },
          },
        },
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(8px)',
            borderRadius: 12,
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              transition: 'border-color 0.2s ease',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.25)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#818cf8',
              borderWidth: '2px',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(8px)',
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.25)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#818cf8',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          border: glassBorder,
        },
      },
    },
  },
});
