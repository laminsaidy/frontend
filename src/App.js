import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./pages/Navbar";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";

function App() {
  console.log("App is rendering");

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Switch>
          <Route exact path="/" render={() => <Homepage />} />
          <Route exact path="/login" render={() => <Loginpage />} />
          <Route exact path="/register" render={() => <Registerpage />} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
