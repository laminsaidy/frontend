import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./pages/Navbar";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";
import TaskManager from "./pages/TaskManager";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Switch>
          <Route exact path="/" render={() => <Homepage />} />
          <Route exact path="/login" render={() => <Loginpage />} />
          <Route exact path="/register" render={() => <Registerpage />} />

          {/* Use PrivateRoute for protected TaskManager page */}
          <PrivateRoute exact path="/tasks" component={TaskManager} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
