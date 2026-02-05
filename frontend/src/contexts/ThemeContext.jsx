import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Check local storage or system preference
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'dark';
    });

    const toggleColorMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', newMode);
            return newMode;
        });
    };

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: {
                main: '#FF6A88', // Brand Color
            },
            secondary: {
                main: '#FF9A8B',
            },
            background: {
                default: mode === 'dark' ? '#0d0d11' : '#f4f6f8',
                paper: mode === 'dark' ? '#1e1e24' : '#ffffff',
            },
            text: {
                primary: mode === 'dark' ? '#ffffff' : '#1a1a1a',
                secondary: mode === 'dark' ? '#a0a0a0' : '#636e72',
            }
        },
        typography: {
            fontFamily: '"Inter", sans-serif',
            h1: { fontWeight: 800 },
            h2: { fontWeight: 700 },
            button: { textTransform: 'none', fontWeight: 600 },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: { borderRadius: '12px' }
                }
            },
            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: 'none' } // Remove default MUI overlay
                }
            }
        }
    }), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleColorMode }}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};