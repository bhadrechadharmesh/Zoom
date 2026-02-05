import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Button, TextField, Typography, Container, Paper, Box, AppBar, Toolbar, IconButton 
} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import KeyboardIcon from '@mui/icons-material/Keyboard';

// --- THEME ---
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#8e44ad' }, // Purple for Guests
        background: { default: '#0d0d11', paper: '#1e1e24' },
    },
    components: {
        MuiButton: { styleOverrides: { root: { borderRadius: '12px' } } },
        MuiTextField: { styleOverrides: { root: { marginBottom: '20px' } } }
    }
});

// --- STYLED COMPONENTS ---
const PageWrapper = styled('div')({
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, #1a1a2e, #0d0d11)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    // Background decorations
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(142, 68, 173, 0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        zIndex: 0,
    }
});

const GlassCard = styled(Paper)({
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
    borderRadius: '24px',
    background: 'rgba(30, 30, 36, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    zIndex: 1,
});

const GradientButton = styled(Button)({
    background: 'linear-gradient(45deg, #8e44ad 30%, #3498db 90%)',
    padding: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'white',
    width: '100%',
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(142, 68, 173, 0.3)',
    '&:hover': {
        background: 'linear-gradient(45deg, #3498db 30%, #8e44ad 90%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(142, 68, 173, 0.5)',
    },
    transition: 'all 0.3s ease'
});

export default function GuestJoin() {
    const navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const handleJoin = () => {
        if (!meetingCode.trim() || !name.trim()) {
            setError("Both fields are required to join.");
            return;
        }
        
        // Pass the name via router state so VideoMeet can pick it up (optional optimization)
        // For now, we just navigate to the URL.
        navigate(`/meet/${meetingCode}`);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <PageWrapper>
                {/* Navbar for easy exit */}
                <AppBar position="fixed" sx={{ background: 'transparent', boxShadow: 'none' }}>
                    <Toolbar>
                        <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
                    <GlassCard elevation={0}>
                        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <VideoCallIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 2 }} />
                            <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
                                Guest Join
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Enter the code to join a meeting instantly. No account needed.
                            </Typography>
                        </Box>

                        <TextField
                            fullWidth
                            label="Your Display Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError("");
                            }}
                            placeholder="Ex. John Doe"
                            InputProps={{
                                style: { color: 'white' }
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Meeting Code"
                            variant="outlined"
                            value={meetingCode}
                            onChange={(e) => {
                                setMeetingCode(e.target.value);
                                setError("");
                            }}
                            placeholder="abc-def-ghi"
                            InputProps={{
                                endAdornment: <KeyboardIcon sx={{ color: 'grey.500' }} />,
                                style: { color: 'white' }
                            }}
                        />

                        {error && (
                            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'left' }}>
                                {error}
                            </Typography>
                        )}

                        <GradientButton onClick={handleJoin}>
                            Join Meeting
                        </GradientButton>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                Want to create your own meeting? 
                                <span 
                                    style={{ color: '#8e44ad', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }}
                                    onClick={() => navigate('/auth')}
                                >
                                    Login here
                                </span>
                            </Typography>
                        </Box>
                    </GlassCard>
                </Container>
            </PageWrapper>
        </ThemeProvider>
    );
}