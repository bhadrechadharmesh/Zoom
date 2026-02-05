import React, { useRef, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import MicOffIcon from '@mui/icons-material/MicOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { IconButton } from '@mui/material';

const VideoWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  background: '#202124',
  borderRadius: '16px', // Softer, modern corners
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  transition: 'transform 0.2s',
  '&:hover': {
      // Subtle lift on hover
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
      '& .video-controls': {
          opacity: 1,
      }
  },
  // When in fullscreen mode, reset styles to fit screen
  '&.fullscreen': {
      borderRadius: 0,
      transform: 'none',
  }
}));

const StyledVideo = styled('video')(({ isLocal }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transform: isLocal ? 'scaleX(-1)' : 'none',
}));

const NameTag = styled('div')({
  position: 'absolute',
  bottom: '16px',
  left: '16px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '24px',
  fontSize: '0.875rem',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  zIndex: 10,
  maxWidth: '80%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const ControlsOverlay = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 20%)',
    opacity: 0, // Hidden by default
    transition: 'opacity 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '16px',
    zIndex: 5,
});

const TopRightIcons = styled('div')({
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    gap: '8px',
});

const StatusBadge = styled('div')({
    backgroundColor: '#ea4335',
    borderRadius: '50%',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
});

const VideoComponent = ({ stream, username, isLocal = false, isAudioEnabled = true }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
          containerRef.current.requestFullscreen().catch(err => {
              console.log(`Error attempting to enable fullscreen: ${err.message}`);
          });
      } else {
          document.exitFullscreen();
      }
  };

  // Listen for native fullscreen changes (ESC key)
  useEffect(() => {
      const handleChange = () => {
          setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', handleChange);
      return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  if (!stream) return null;

  return (
    <VideoWrapper ref={containerRef} className={isFullscreen ? 'fullscreen' : ''}>
      <StyledVideo
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal} 
        isLocal={isLocal}
      />
      
      {/* Overlay controls that appear on hover */}
      <ControlsOverlay className="video-controls">
          <TopRightIcons>
              <IconButton 
                  onClick={toggleFullscreen}
                  size="small"
                  sx={{ backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' } }}
              >
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
          </TopRightIcons>
      </ControlsOverlay>

      <NameTag>
        {username || "User"} 
        {isLocal && " (You)"}
      </NameTag>

      {/* Persistent Mute Icon if user is muted */}
      {!isAudioEnabled && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
              <StatusBadge>
                  <MicOffIcon fontSize="small" />
              </StatusBadge>
          </div>
      )}
    </VideoWrapper>
  );
};

export default React.memo(VideoComponent);