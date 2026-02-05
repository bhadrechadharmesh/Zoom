import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Alert, CircularProgress, Paper, IconButton, InputAdornment } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// --- CUSTOM THEME & STYLES ---
const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#FF9A8B', // Soft Coral gradient start
        },
        secondary: {
            main: '#FF6A88', // Gradient mid
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        transition: '0.3s',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #FF9A8B 30%, #FF6A88 90%)',
                    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                    color: 'white',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #FF6A88 30%, #FF99AC 90%)',
                    }
                }
            }
        }
    }
});

export default function Authentication() {
    // STATE
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    
    // 0 = Login, 1 = Register
    const [formState, setFormState] = React.useState(0); 
    const [loading, setLoading] = React.useState(false);
    
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: "",
        severity: "success"
    });

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        
        if (!username || !password || (formState === 1 && !name)) {
            setSnackbar({ open: true, message: "Please fill in all fields", severity: "error" });
            return;
        }

        setLoading(true);

        try {
            if (formState === 0) {
                await handleLogin(username, password);
            } 
            else if (formState === 1) {
                let result = await handleRegister(name, username, password);
                setSnackbar({ open: true, message: result || "Registration Successful!", severity: "success" });
                setFormState(0); 
                setUsername("");
                setPassword("");
                setName("");
            }
        } catch (err) {
            let errMsg = err.response?.data?.message || err.message || "Something went wrong";
            setSnackbar({ open: true, message: errMsg, severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)`, // Subtle base
                backgroundImage: `url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2000&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}>
                {/* Overlay for readability */}
                <Box sx={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(4px)'
                }} />

                <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 2 }}>
                    <CssBaseline />
                    <Paper 
                        elevation={24}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: 4,
                            borderRadius: '24px',
                            backgroundColor: 'rgba(255, 255, 255, 0.85)', // Glass effect
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                            <LockOutlinedIcon fontSize="large" />
                        </Avatar>
                        
                        <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
                            {formState === 0 ? "Welcome Back" : "Join Us"}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {formState === 0 ? "Enter your credentials to access your account" : "Create your account to get started"}
                        </Typography>

                        <Box component="form" onSubmit={handleAuth} noValidate sx={{ mt: 1, width: '100%' }}>
                            
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    variant="outlined"
                                />
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus={formState === 0}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="cooluser123"
                                variant="outlined"
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                disabled={loading}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : (formState === 0 ? "Sign In" : "Sign Up")}
                            </Button>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {formState === 0 ? "Don't have an account? " : "Already have an account? "}
                                    <span 
                                        style={{ color: '#FF6A88', cursor: 'pointer', fontWeight: 'bold' }}
                                        onClick={() => {
                                            setFormState(formState === 0 ? 1 : 0);
                                            setUsername("");
                                            setPassword("");
                                            setName("");
                                        }}
                                    >
                                        {formState === 0 ? "Sign Up" : "Sign In"}
                                    </span>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Container>

                <Snackbar 
                    open={snackbar.open} 
                    autoHideDuration={4000} 
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '12px' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
}