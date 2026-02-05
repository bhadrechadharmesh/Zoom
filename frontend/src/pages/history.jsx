import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, IconButton, Grid, Chip, Button, Box, Snackbar, Alert } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import { styled } from '@mui/material/styles';

// --- STYLES ---
const HistoryPageWrapper = styled('div')({
    minHeight: '100vh',
    background: '#121212',
    color: 'white',
    padding: '40px',
});

const Header = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '20px',
});

const HistoryCard = styled(Card)({
    background: '#1e1e1e',
    color: 'white',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
        borderColor: '#FF6A88',
    }
});

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // handle error
            }
        }
        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setSnackbarOpen(true);
    };

    return (
        <HistoryPageWrapper>
            <Header>
                <div>
                    <Typography variant="h4" fontWeight="bold">Your Meetings</Typography>
                    <Typography variant="body2" color="grey.500">Track and rejoin your past sessions</Typography>
                </div>
                <Button 
                    startIcon={<HomeIcon />} 
                    variant="outlined" 
                    onClick={() => navigate("/home")}
                    sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', borderRadius: '20px' }}
                >
                    Back to Home
                </Button>
            </Header>

            {meetings.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10, opacity: 0.5 }}>
                    <VideoCameraFrontIcon sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h6">No meeting history yet.</Typography>
                    <Button onClick={() => navigate("/home")} sx={{ mt: 2 }}>Create one now</Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {meetings.map((e, i) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                            <HistoryCard elevation={3}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Chip 
                                            icon={<CalendarTodayIcon sx={{ fontSize: '14px !important' }} />} 
                                            label={formatDate(e.date)} 
                                            size="small" 
                                            sx={{ background: 'rgba(255,255,255,0.1)', color: 'grey.300' }}
                                        />
                                    </Box>

                                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, letterSpacing: '1px' }}>
                                        {e.meetingCode}
                                    </Typography>
                                    
                                    <Typography variant="body2" color="grey.500" sx={{ mb: 3 }}>
                                        Hosted on Dhamsa Call
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button 
                                            variant="contained" 
                                            fullWidth 
                                            onClick={() => navigate(`/${e.meetingCode}`)}
                                            sx={{ 
                                                background: 'white', 
                                                color: 'black', 
                                                fontWeight: 'bold',
                                                '&:hover': { background: '#ddd' }
                                            }}
                                        >
                                            Rejoin
                                        </Button>
                                        <IconButton 
                                            onClick={() => handleCopy(e.meetingCode)}
                                            sx={{ color: 'grey.500', border: '1px solid rgba(255,255,255,0.1)' }}
                                        >
                                            <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </HistoryCard>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message="Meeting code copied!"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>Meeting Code Copied!</Alert>
            </Snackbar>
        </HistoryPageWrapper>
    );
}