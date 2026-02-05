import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Button, Container, Typography, Grid, Paper, IconButton, 
    CssBaseline, useMediaQuery 
} from '@mui/material';
import { styled, keyframes, ThemeProvider, createTheme } from '@mui/material/styles';

// Icons
import VideoCallIcon from '@mui/icons-material/VideoCall';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun

// --- ANIMATIONS ---
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- STYLED COMPONENTS ---

const PageWrapper = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    width: '100%',
    // Dynamic background based on mode
    background: theme.palette.mode === 'dark' 
        ? '#0d0d11' 
        : '#f0f2f5', 
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    position: 'relative',
    transition: 'background 0.3s ease, color 0.3s ease',
    
    // Background Orbs (Glow effects)
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: theme.palette.mode === 'dark' 
            ? 'radial-gradient(circle, rgba(255, 106, 136, 0.15) 0%, rgba(0,0,0,0) 70%)'
            : 'radial-gradient(circle, rgba(255, 106, 136, 0.1) 0%, rgba(0,0,0,0) 60%)',
        borderRadius: '50%',
        zIndex: 0,
        pointerEvents: 'none',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(100, 100, 255, 0.1) 0%, rgba(0,0,0,0) 70%)'
            : 'radial-gradient(circle, rgba(100, 100, 255, 0.08) 0%, rgba(0,0,0,0) 60%)',
        borderRadius: '50%',
        zIndex: 0,
        pointerEvents: 'none',
    }
}));

const Navbar = styled('nav')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    zIndex: 10,
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    // Dynamic Glass Effect
    background: theme.palette.mode === 'dark' 
        ? 'rgba(13, 13, 17, 0.7)' 
        : 'rgba(255, 255, 255, 0.7)',
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: 'background 0.3s ease, border-color 0.3s ease',
}));

const Logo = styled('div')({
    fontSize: '1.5rem',
    fontWeight: '800',
    background: 'linear-gradient(45deg, #FF9A8B, #FF6A88)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
});

const HeroSection = styled(Container)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '60px',
    paddingBottom: '80px',
    zIndex: 1,
    minHeight: '80vh',
    '@media (max-width: 900px)': {
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'center',
        gap: '40px'
    }
});

const HeroText = styled('div')({
    flex: 1,
    animation: `${fadeIn} 1s ease-out`,
});

const HeroImageWrapper = styled('div')({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    animation: `${fadeIn} 1s ease-out 0.3s backwards`,
});

const FloatingImage = styled('img')({
    width: '100%',
    maxWidth: '500px',
    height: 'auto',
    borderRadius: '24px',
    animation: `${float} 6s ease-in-out infinite`,
    boxShadow: '0 20px 80px rgba(0,0,0,0.15)',
});

const FeatureCard = styled(Paper)(({ theme }) => ({
    padding: '30px',
    // Card Background adapts to mode
    background: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.03)' 
        : 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '24px',
    color: theme.palette.text.primary,
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: theme.shadows[1],
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: theme.shadows[10],
        borderColor: '#FF6A88',
    }
}));

const GradientButton = styled(Button)({
    background: 'linear-gradient(45deg, #FF9A8B 30%, #FF6A88 90%)',
    borderRadius: '50px',
    padding: '12px 36px',
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 20px rgba(255, 106, 136, 0.4)',
    color: 'white',
    '&:hover': {
        background: 'linear-gradient(45deg, #FF6A88 30%, #FF99AC 90%)',
        boxShadow: '0 6px 25px rgba(255, 106, 136, 0.6)',
    }
});

export default function Landing() {
    const router = useNavigate();
    
    // --- THEME STATE ---
    // Check system preference or default to dark
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    // Create Theme dynamically
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                              // Light Mode Palette
                              text: { primary: '#2d3436', secondary: '#636e72' },
                              divider: 'rgba(0, 0, 0, 0.06)',
                              background: { paper: '#ffffff' }
                          }
                        : {
                              // Dark Mode Palette
                              text: { primary: '#ffffff', secondary: '#b2bec3' },
                              divider: 'rgba(255, 255, 255, 0.05)',
                              background: { paper: '#1e1e1e' }
                          }),
                },
                typography: {
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                }
            }),
        [mode],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <PageWrapper>
                <Navbar>
                    <Logo onClick={() => router('/')}>
                        <VideoCallIcon /> Dhamsa Call
                    </Logo>
                    
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {/* THEME TOGGLE BUTTON */}
                        <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary' }}>
                            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>

                        <Button 
                            onClick={() => router("/guest")} 
                            sx={{ color: 'text.primary', textTransform: 'none', display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}
                        >
                            Join as Guest
                        </Button>
                        <Button 
                            onClick={() => router("/auth")} 
                            sx={{ color: 'text.primary', textTransform: 'none', fontWeight: 500 }}
                        >
                            Login
                        </Button>
                        <Button 
                            variant="outlined" 
                            onClick={() => router("/auth")}
                            sx={{ 
                                color: '#FF6A88', 
                                borderColor: '#FF6A88', 
                                borderRadius: '20px', 
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { borderColor: '#FF9A8B', background: 'rgba(255, 106, 136, 0.1)' }
                            }}
                        >
                            Register
                        </Button>
                    </div>
                </Navbar>

                <HeroSection maxWidth="lg">
                    <HeroText>
                        <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: '3rem', md: '4.5rem' }, lineHeight: 1.1, mb: 2, color: 'text.primary' }}>
                            Connect with your <br />
                            <span style={{ 
                                background: 'linear-gradient(45deg, #FF9A8B, #FF6A88)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Loved Ones.
                            </span>
                        </Typography>
                        
                        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4, maxWidth: '600px', fontSize: { xs: '1rem', md: '1.25rem' }, lineHeight: 1.6 }}>
                            High-quality video conferencing that bridges the distance. 
                            Free, secure, and available on all devices.
                        </Typography>

                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <GradientButton onClick={() => router("/auth")}>
                                Get Started
                            </GradientButton>
                            <Button 
                                variant="text" 
                                onClick={() => router("/guest")}
                                sx={{ color: 'text.primary', fontSize: '1.1rem', textTransform: 'none' }}
                            >
                                Try as Guest →
                            </Button>
                        </div>
                    </HeroText>

                    <HeroImageWrapper>
                        <FloatingImage 
                            src="https://images.unsplash.com/photo-1612831455359-970e23a1e4e9?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                            alt="Video Call Illustration" 
                        />
                    </HeroImageWrapper>
                </HeroSection>

                {/* Features Section */}


                <Box sx={{ textAlign: 'center', py: 4, borderTop: `1px solid ${theme.palette.divider}`, color: 'text.secondary' }}>
                    <Typography variant="body2">© 2026 Dhamsa Call. All rights reserved.</Typography>
                </Box>

            </PageWrapper>
        </ThemeProvider>
    );
}