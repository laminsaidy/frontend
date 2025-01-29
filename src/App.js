import React from 'react'

import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import PrivateRoute from "./utils/PrivateRoute"
import { AuthProvider } from './context/AuthContext'


import Navbar from './pages/Navbar'
import Homepage from './pages/Homepage'


function App() {
  return (
    <Router>
      <AuthProvider>
        < Navbar/>

      </AuthProvider>     
    </Router>
    )
}      
export default App;
