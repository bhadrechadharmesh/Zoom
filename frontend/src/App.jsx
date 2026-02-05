import React, { useContext } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

import Landing from './pages/Landing.jsx';
import Authentication from './pages/Authentication.jsx';
import VideoMeet from './pages/VideoMeet.jsx';
import HomeComponent from './pages/home'; // Make sure the filename case matches (Home vs home)
import History from './pages/history';
import GuestJoin from './pages/GuestJoin'; // Assuming you have a guest page

import './App.css';

// --- PROTECTION COMPONENT ---
const PrivateRoute = ({ children }) => {
  const { userData } = useContext(AuthContext);
  
  // If no user data (token), redirect to Auth page
  if (!userData) {
    return <Navigate to="/auth" replace />;
  }

  // If logged in, show the protected page
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/' element={<Landing />} />
      <Route path='/auth' element={<Authentication />} />
      <Route path='/guest' element={<GuestJoin />} /> {/* If you have a guest route */}

      {/* Protected Routes (Wrapped in PrivateRoute) */}
      <Route 
        path='/home' 
        element={
          <PrivateRoute>
             <HomeComponent />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path='/history' 
        element={
          <PrivateRoute>
             <History />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path='/meet/:url' 
        element={
          <PrivateRoute>
             <VideoMeet />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
         <ThemeProvider>
            <AppRoutes />
         </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;