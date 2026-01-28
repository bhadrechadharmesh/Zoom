import React from 'react'
import {Link} from "react-router-dom"
import "../App.css"
export default function Landing() {
  return (
    <>
      <div className='landingPageContainer'>
        <nav>
          <div className='navHeader'>
            <h2>Dhamsa Call</h2>
          </div>
          <div className='navList'>
            <p>Join as Guest</p>
            <p>Register</p>
            <div role='button'><p>Login</p></div>
          </div>
        </nav>

        <div className="landingMainContainer">
          <div>
            <h1><span style={{color:"orange"}}>Connect </span>with your loved ones</h1>
            <p>Cover a distance by your imagination</p>
            <div role='button'>
              <Link to="/auth">Get Started</Link>
            </div>
          </div>
          <div>
            <img src="/mobile.png" alt="mobile" />
          </div>
        </div>

      </div>
    </>
  )
}
