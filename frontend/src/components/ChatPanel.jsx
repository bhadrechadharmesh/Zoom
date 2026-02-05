import React, { useState, useRef, useEffect } from 'react';
import { 
    Box, IconButton, TextField, Typography, Paper, Avatar 
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

// --- ANIMATIONS ---
const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// --- STYLED COMPONENTS ---
const PanelContainer = styled(Paper)(({ theme }) => ({
    position: 'fixed',
    right: '20px',
    bottom: '100px', // Above the control bar
    width: '360px',
    height: '65vh', // Takes up reasonable vertical space
    maxHeight: '600px',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 36, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 90,
    animation: `${slideIn} 0.3s ease-out forwards`,
    border: `1px solid ${theme.palette.divider}`,
}));

const Header = styled(Box)(({ theme }) => ({
    padding: '16px 20px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
}));

const MessageList = styled(Box)({
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    // Hide scrollbar but keep functionality
    '&::-webkit-scrollbar': { width: '6px' },
    '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(100,100,100,0.3)', borderRadius: '3px' },
});

const Bubble = styled(Box)(({ isMe, theme }) => ({
    maxWidth: '80%',
    padding: '10px 16px',
    borderRadius: '18px',
    // Logic for bubble shape (corners)
    borderBottomRightRadius: isMe ? '4px' : '18px',
    borderBottomLeftRadius: isMe ? '18px' : '4px',
    
    // Colors
    backgroundColor: isMe 
        ? '#FF6A88' // Brand Color for Me
        : theme.palette.mode === 'dark' ? '#333' : '#f0f2f5', // Grey for others
    color: isMe ? 'white' : theme.palette.text.primary,
    
    // Alignment
    alignSelf: isMe ? 'flex-end' : 'flex-start',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    position: 'relative',
    wordWrap: 'break-word',
}));

const SenderName = styled(Typography)({
    fontSize: '0.75rem',
    color: '#888',
    marginBottom: '4px',
    marginLeft: '4px',
});

const InputArea = styled(Box)(({ theme }) => ({
    padding: '16px',
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    gap: '10px',
    background: theme.palette.background.paper,
}));

// --- COMPONENT ---
export default function ChatPanel({ messages, sendMessage, onClose, username }) {
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput("");
        }
    };

    return (
        <PanelContainer elevation={0}>
            <Header>
                <Typography variant="h6" fontWeight="bold">In-Call Messages</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Header>

            <MessageList>
                {messages.length === 0 && (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                        No messages yet. Say hello! 👋
                    </Typography>
                )}

                {messages.map((msg, index) => {
                    // Check if the message is from the local user
                    const isMe = msg.sender === username || msg.sender === "Me";
                    
                    return (
                        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                            {!isMe && <SenderName>{msg.sender}</SenderName>}
                            <Bubble isMe={isMe}>
                                <Typography variant="body2">{msg.data}</Typography>
                            </Bubble>
                        </Box>
                    );
                })}
                <div ref={bottomRef} />
            </MessageList>

            <InputArea>
                <TextField 
                    fullWidth 
                    variant="outlined" 
                    placeholder="Type a message..." 
                    size="small"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    sx={{ 
                        '& .MuiOutlinedInput-root': { 
                            borderRadius: '20px',
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : '#f9f9f9'
                        } 
                    }}
                />
                <IconButton 
                    onClick={handleSend} 
                    sx={{ 
                        backgroundColor: '#FF6A88', 
                        color: 'white',
                        '&:hover': { backgroundColor: '#FF4D6D' }
                    }}
                >
                    <SendIcon fontSize="small" />
                </IconButton>
            </InputArea>
        </PanelContainer>
    );
}