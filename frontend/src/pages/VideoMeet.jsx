import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button, CircularProgress, Tooltip, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import VideoComponent from '../components/VideoComponent';
import ChatPanel from '../components/ChatPanel';
import server from '../environment';

const server_url = server;

// --- STYLES (Keep your existing styles) ---
const MainContainer = styled('div')({
    height: '100vh',
    width: '100vw',
    backgroundColor: '#121212',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});

const VideoGrid = styled('div')(({ total }) => {
    let columns = '1fr';
    if (total === 2) columns = '1fr 1fr';
    if (total >= 3) columns = 'repeat(auto-fit, minmax(400px, 1fr))';
    return {
        flex: 1,
        display: 'grid',
        gridTemplateColumns: columns,
        gap: '20px',
        padding: '20px',
        justifyContent: 'center',
        alignContent: 'center',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        overflowY: 'auto',
    };
});

const ControlBar = styled('div')({
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '16px',
    padding: '12px 24px',
    borderRadius: '50px',
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    zIndex: 100,
    alignItems: 'center',
});

const ControlButton = styled(IconButton)(({ active, variant }) => ({
    backgroundColor: active ? '#3c4043' : (variant === 'danger' ? '#ea4335' : '#8ab4f8'),
    color: 'white',
    width: '50px',
    height: '50px',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: active ? '#505458' : (variant === 'danger' ? '#d93025' : '#aecbfa'),
        transform: 'scale(1.1)',
    }
}));

const LobbyContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'white',
    gap: '2rem',
    background: 'radial-gradient(circle at center, #2a2a2a 0%, #121212 100%)',
});

// --- MAIN COMPONENT ---

export default function VideoMeetComponent() {
    const socketRef = useRef();
    const socketIdRef = useRef();
    const localVideoRef = useRef();
    
    const connections = useRef({});
    const localStreamRef = useRef(null);
    
    // NEW: Ref to store usernames before video loads
    const usernamesRef = useRef({}); 

    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [screen, setScreen] = useState(false);
    const [showModal, setModal] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState(0);
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [meetingLinkCopied, setMeetingLinkCopied] = useState(false);

    useEffect(() => {
        getPermissions();
    }, []);

    const getPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setVideoAvailable(true);
            setAudioAvailable(true);
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error(error);
            setVideoAvailable(false);
            setAudioAvailable(false);
        }
    };

    const connect = () => {
        if(!username) return;
        setAskForUsername(false);
        setLoading(true);
        connectToSocketServer();
    };

    const connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });

        socketRef.current.on('connect', () => {
            setLoading(false);
            socketIdRef.current = socketRef.current.id;
            socketRef.current.emit('join-call', window.location.href);
            
            socketRef.current.on('signal', gotMessageFromServer);
            socketRef.current.on('chat-message', addMessage);
            
            socketRef.current.on('user-left', (id) => {
                setVideos((prev) => prev.filter((v) => v.socketId !== id));
                if(connections.current[id]) {
                    connections.current[id].close();
                    delete connections.current[id];
                }
            });

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                    connections.current[socketListId] = new RTCPeerConnection({
                        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
                    });
                    
                    if(localStreamRef.current) {
                         localStreamRef.current.getTracks().forEach(track => {
                             connections.current[socketListId].addTrack(track, localStreamRef.current);
                         });
                    }

                    connections.current[socketListId].onicecandidate = (event) => {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                        }
                    };

                    connections.current[socketListId].ontrack = (event) => {
                        setVideos(prev => {
                            if(prev.find(v => v.socketId === socketListId)) return prev;
                            // 1. GET NAME FROM REF
                            const remoteName = usernamesRef.current[socketListId] || "Participant";
                            return [...prev, { socketId: socketListId, stream: event.streams[0], username: remoteName }];
                        });
                    };

                    if (socketIdRef.current === id) {
                        connections.current[socketListId].createOffer().then((description) => {
                            connections.current[socketListId].setLocalDescription(description)
                                .then(() => {
                                    // 2. SEND USERNAME WITH OFFER
                                    socketRef.current.emit('signal', socketListId, JSON.stringify({ 
                                        'sdp': connections.current[socketListId].localDescription,
                                        'username': username 
                                    }));
                                });
                        });
                    }
                });
            });
        });
    };

    const gotMessageFromServer = (fromId, message) => {
        const signal = JSON.parse(message);

        // 3. STORE INCOMING USERNAME
        if (signal.username) {
            usernamesRef.current[fromId] = signal.username;
            // Update existing video if stream is already there
            setVideos(prev => prev.map(v => v.socketId === fromId ? { ...v, username: signal.username } : v));
        }

        if (fromId !== socketIdRef.current && connections.current[fromId]) {
            if (signal.sdp) {
                connections.current[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections.current[fromId].createAnswer().then((description) => {
                            connections.current[fromId].setLocalDescription(description).then(() => {
                                // 4. SEND USERNAME WITH ANSWER
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 
                                    'sdp': connections.current[fromId].localDescription,
                                    'username': username 
                                }));
                            });
                        });
                    }
                });
            }
            if (signal.ice) {
                connections.current[fromId].addIceCandidate(new RTCIceCandidate(signal.ice));
            }
        }
    };

    // --- MESSAGING LOGIC ---
    const sendMessage = (msg) => {
        if(msg.trim()) {
            socketRef.current.emit('chat-message', msg, username);
            setMessages(prev => [...prev, { sender: "You", data: msg }]);
            setMessage(""); 
        }
    };

    const addMessage = (data, sender, socketIdSender) => {
        if (socketIdSender === socketIdRef.current) return;
        setMessages((prev) => [...prev, { sender: sender, data: data }]);
        setNewMessages((prev) => prev + 1);
    };

    // --- UTILS ---
    const toggleVideo = () => {
        if(localStreamRef.current) {
            localStreamRef.current.getVideoTracks()[0].enabled = !video;
            setVideo(!video);
        }
    };

    const toggleAudio = () => {
        if(localStreamRef.current) {
            localStreamRef.current.getAudioTracks()[0].enabled = !audio;
            setAudio(!audio);
        }
    };

    const handleScreenShare = async () => {
        if (!screen) {
            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
                const screenTrack = displayStream.getTracks()[0];
                Object.keys(connections.current).forEach((key) => {
                    const sender = connections.current[key].getSenders().find((s) => s.track.kind === "video");
                    if (sender) sender.replaceTrack(screenTrack);
                });
                localStreamRef.current = displayStream; 
                setVideos(prev => [...prev]); 
                screenTrack.onended = () => { stopScreenShare(); };
                setScreen(true);
            } catch (err) { console.log(err); }
        } else {
            stopScreenShare();
        }
    };

    const stopScreenShare = async () => {
        const userMedia = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const videoTrack = userMedia.getVideoTracks()[0];
        Object.keys(connections.current).forEach((key) => {
            const sender = connections.current[key].getSenders().find((s) => s.track.kind === "video");
            if (sender) sender.replaceTrack(videoTrack);
        });
        localStreamRef.current = userMedia;
        setScreen(false);
    };

    const handleEndCall = () => {
        if(localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
        window.location.href = "/home";
    };

    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href);
        setMeetingLinkCopied(true);
    };

    return (
        <MainContainer>
            {askForUsername ? (
                <LobbyContainer>
                    <h1>Get Ready</h1>
                    <div style={{ width: '600px', height: '400px', background: '#000', borderRadius: '15px', overflow: 'hidden' }}>
                        <video ref={localVideoRef} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <TextField 
                            sx={{ input: { color: 'white' }, fieldset: { borderColor: 'white' } }} 
                            label="Your Name" 
                            focused
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                        />
                        <Button variant="contained" onClick={connect} disabled={loading || !username} size="large">
                            {loading ? "Connecting..." : "Join Now"}
                        </Button>
                    </div>
                </LobbyContainer>
            ) : (
                <>
                    <VideoGrid total={videos.length + 1}>
                        <VideoComponent 
                            stream={localStreamRef.current} 
                            username={username} 
                            isLocal={!screen} 
                            isAudioEnabled={audio}
                        />
                        {videos.map((v) => (
                            <VideoComponent 
                                key={v.socketId} 
                                stream={v.stream} 
                                username={v.username} // NOW PASSING THE NAME
                                isAudioEnabled={true} 
                            />
                        ))}
                    </VideoGrid>

                    <ControlBar>
                        <Tooltip title={video ? "Turn Off Camera" : "Turn On Camera"}>
                            <ControlButton onClick={toggleVideo} active={!video} variant="secondary">
                                {video ? <VideocamIcon /> : <VideocamOffIcon />}
                            </ControlButton>
                        </Tooltip>
                        <Tooltip title={audio ? "Mute Mic" : "Unmute Mic"}>
                            <ControlButton onClick={toggleAudio} active={!audio} variant="secondary">
                                {audio ? <MicIcon /> : <MicOffIcon />}
                            </ControlButton>
                        </Tooltip>
                        <Tooltip title={screen ? "Stop Sharing" : "Share Screen"}>
                            <ControlButton onClick={handleScreenShare} active={screen} variant="primary">
                                {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                            </ControlButton>
                        </Tooltip>
                        <Tooltip title="End Call">
                            <ControlButton onClick={handleEndCall} variant="danger">
                                <CallEndIcon />
                            </ControlButton>
                        </Tooltip>
                        <div style={{ width: '1px', height: '30px', background: '#555', margin: '0 10px' }}></div>
                        <Tooltip title="Chat">
                            <Badge badgeContent={newMessages} color="primary">
                                <ControlButton onClick={() => { setModal(!showModal); setNewMessages(0); }} active={showModal}>
                                    <ChatIcon />
                                </ControlButton>
                            </Badge>
                        </Tooltip>
                        <Tooltip title="Copy Meeting Link">
                             <ControlButton onClick={copyUrl} style={{ borderRadius: '12px' }}>
                                <ContentCopyIcon />
                             </ControlButton>
                        </Tooltip>
                    </ControlBar>

                    {showModal && (
                        <ChatPanel 
                            messages={messages} 
                            sendMessage={sendMessage} 
                            onClose={() => setModal(false)}
                            username={username}
                        />
                    )}
                    
                    <Snackbar
                        open={meetingLinkCopied}
                        autoHideDuration={2000}
                        onClose={() => setMeetingLinkCopied(false)}
                        message="Meeting link copied to clipboard!"
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert severity="success" sx={{ width: '100%' }}>Link Copied!</Alert>
                    </Snackbar>
                </>
            )}
        </MainContainer>
    );
}