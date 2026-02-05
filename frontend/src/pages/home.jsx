import React, { useContext, useState, useEffect } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import { 
    Button, IconButton, TextField, Box, Typography, Grid, Paper, Avatar, Divider, Tooltip 
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useThemeContext } from '../contexts/ThemeContext'; // Import global theme hook
import { AuthContext } from '../contexts/AuthContext';

// Icons
import AddBoxIcon from '@mui/icons-material/AddBox';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import VideocamIcon from '@mui/icons-material/Videocam';
import SettingsIcon from '@mui/icons-material/Settings';

// --- STYLED COMPONENTS ---

const DashboardLayout = styled('div')(({ theme }) => ({
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    transition: 'background-color 0.3s',
}));

// Sidebar
const Sidebar = styled('div')(({ theme }) => ({
    width: '80px',
    borderRight: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 0',
    gap: '24px',
    backgroundColor: theme.palette.mode === 'dark' ? alpha('#fff', 0.02) : '#fff',
    zIndex: 10,
    '@media (max-width: 600px)': {
        display: 'none' // Hide on mobile, move to bottom nav ideally
    }
}));

const NavItem = styled(IconButton)(({ theme, active }) => ({
    borderRadius: '16px',
    padding: '12px',
    color: active ? '#FF6A88' : theme.palette.text.secondary,
    backgroundColor: active ? alpha('#FF6A88', 0.1) : 'transparent',
    transition: 'all 0.2s',
    '&:hover': {
        backgroundColor: alpha(theme.palette.text.primary, 0.05),
        transform: 'scale(1.05)',
    }
}));

// Main Content
const MainContent = styled('div')({
    flex: 1,
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    maxWidth: '1600px',
    margin: '0 auto',
    '@media (max-width: 600px)': {
        padding: '20px'
    }
});

const ActionCard = styled(Paper)(({ theme }) => ({
    padding: '30px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: '240px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.3s ease',
    background: theme.palette.background.paper,
    
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: theme.palette.mode === 'dark' 
            ? '0 10px 40px rgba(0,0,0,0.5)' 
            : '0 10px 40px rgba(0,0,0,0.1)',
        borderColor: '#FF6A88',
        '& .icon-bg': {
            transform: 'scale(1.2) rotate(10deg)',
            opacity: 0.2
        }
    }
}));

const IconBackground = styled('div')({
    position: 'absolute',
    bottom: '-20px',
    right: '-20px',
    fontSize: '180px',
    opacity: 0.05,
    transition: 'all 0.4s ease',
    pointerEvents: 'none',
});

function HomeComponent() {
    const navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [dateTime, setDateTime] = useState(new Date());
    
    // Use Global Contexts
    const { addToUserHistory, userData } = useContext(AuthContext);
    const { mode, toggleColorMode } = useThemeContext();

    // Clock effect
    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleJoinVideoCall = async () => {
        if (meetingCode.trim()) {
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        }
    };

    const handleCreateMeeting = async () => {
        const code = Math.random().toString(36).substring(2, 8);
        await addToUserHistory(code);
        navigate(`/${code}`);
    }

    // Format Date/Time
    const timeString = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = dateTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <DashboardLayout>
            {/* --- SIDEBAR NAVIGATION --- */}
            <Sidebar>
                <Avatar sx={{ bgcolor: 'linear-gradient(45deg, #FF6A88, #FF9A8B)', width: 40, height: 40, mb: 2 }}>
                    D
                </Avatar>
                
                <Tooltip title="Home" placement="right">
                    <NavItem active={true} onClick={() => {}}>
                        <VideocamIcon />
                    </NavItem>
                </Tooltip>

                <Tooltip title="History" placement="right">
                    <NavItem onClick={() => navigate("/history")}>
                        <HistoryIcon />
                    </NavItem>
                </Tooltip>

                <div style={{ flex: 1 }} /> {/* Spacer */}

                <Tooltip title="Toggle Theme" placement="right">
                    <NavItem onClick={toggleColorMode}>
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </NavItem>
                </Tooltip>
                
                <Tooltip title="Logout" placement="right">
                    <NavItem onClick={() => { localStorage.removeItem("token"); navigate("/auth"); }}>
                        <LogoutIcon />
                    </NavItem>
                </Tooltip>
            </Sidebar>

            {/* --- MAIN CONTENT --- */}
            <MainContent>
                
                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                    <div>
                        <Typography variant="h4" fontWeight="800">
                            Dashboard
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Welcome back, let's connect.
                        </Typography>
                    </div>
                    
                    {/* Clock Display */}
                    <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                        <Typography variant="h4" fontWeight="600" color="primary">
                            {timeString}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {dateString}
                        </Typography>
                    </Box>
                </Box>

                {/* Action Grid */}
                <Grid container spacing={4}>
                    
                    {/* Card 1: New Meeting */}
                    <Grid item xs={12} md={4}>
                        <ActionCard onClick={handleCreateMeeting} elevation={0}>
                            <Box sx={{ 
                                bgcolor: '#FF6A88', 
                                width: 50, height: 50, borderRadius: '14px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 
                            }}>
                                <AddBoxIcon sx={{ color: 'white' }} />
                            </Box>
                            <div>
                                <Typography variant="h5" fontWeight="bold">New Meeting</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Create a new room and invite others instantly.
                                </Typography>
                            </div>
                            <IconBackground className="icon-bg">
                                <VideocamIcon sx={{ fontSize: 'inherit' }} />
                            </IconBackground>
                        </ActionCard>
                    </Grid>

                    {/* Card 2: Join Meeting */}
                    <Grid item xs={12} md={5}>
                        <ActionCard sx={{ cursor: 'default' }} elevation={0}>
                            <Box sx={{ 
                                bgcolor: mode === 'dark' ? '#333' : '#eee', 
                                width: 50, height: 50, borderRadius: '14px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 
                            }}>
                                <KeyboardIcon sx={{ color: mode === 'dark' ? 'white' : '#555' }} />
                            </Box>
                            
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h5" fontWeight="bold">Join Meeting</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Enter code to join an existing call.
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField 
                                        fullWidth 
                                        placeholder="abc-def-ghi" 
                                        variant="outlined"
                                        size="small"
                                        value={meetingCode}
                                        onChange={e => setMeetingCode(e.target.value)}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': { borderRadius: '10px' } 
                                        }}
                                    />
                                    <Button 
                                        variant="contained" 
                                        onClick={handleJoinVideoCall}
                                        disabled={!meetingCode}
                                        sx={{ borderRadius: '10px', px: 3, background: '#FF6A88', '&:hover': { background: '#ff4d73' } }}
                                    >
                                        Join
                                    </Button>
                                </Box>
                            </Box>
                            <IconBackground className="icon-bg">
                                <KeyboardIcon sx={{ fontSize: 'inherit' }} />
                            </IconBackground>
                        </ActionCard>
                    </Grid>

                    {/* Card 3: History Teaser */}
                    <Grid item xs={12} md={3}>
                        <ActionCard onClick={() => navigate("/history")} elevation={0} sx={{ height: '240px', background: 'linear-gradient(135deg, #FF9A8B 0%, #FF6A88 100%)', color: 'white', border: 'none' }}>
                             <Box sx={{ 
                                bgcolor: 'rgba(255,255,255,0.2)', 
                                width: 50, height: 50, borderRadius: '14px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 
                            }}>
                                <HistoryIcon sx={{ color: 'white' }} />
                            </Box>
                            <div>
                                <Typography variant="h5" fontWeight="bold">History</Typography>
                                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                                    View your past meetings and recordings.
                                </Typography>
                            </div>
                        </ActionCard>
                    </Grid>
                </Grid>

                {/* Bottom Section (Optional Illustration or Recent) */}
                <Box sx={{ mt: 6, opacity: 0.6, textAlign: 'center' }}>
                     <Typography variant="caption">
                        Dhamsa Call v1.0 • Secure & Encrypted
                     </Typography>
                </Box>

            </MainContent>
        </DashboardLayout>
    );
}

export default HomeComponent