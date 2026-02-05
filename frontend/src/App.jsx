import React from 'react'
import {Routes,Route,BrowserRouter as Router} from "react-router-dom"
import Landing from './pages/Landing.jsx'
import Authentication from './pages/Authentication.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import VideoMeet from './pages/VideoMeet.jsx'
import HomeComponent from './pages/home';
import History from './pages/history';
import { ThemeProvider } from './contexts/ThemeContext';

import './App.css'
 
const App = () => {
  return (
   <>
      <Router>
        <AuthProvider>
          <ThemeProvider>
          <Routes>
           
            <Route path='/' element={<Landing/>}/>
            <Route path='/auth' element={<Authentication/>}/>
            <Route path='/home's element={<HomeComponent />} />
            <Route path='/history' element={<History />} />
            <Route path='/:url' element={<VideoMeet/>} />
          </Routes>
          </ThemeProvider>
        </AuthProvider>
      </Router>
   </>
  )
}

export default App
