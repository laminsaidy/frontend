import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./pages/Navbar";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";
import TaskManager from "./pages/TaskManager";
import TaskDetail from "./pages/TaskDetail";
import AddTask from "./pages/AddTask"; 
import TaskStatistics from "./pages/TaskStatistics"; 
import NotFound from "./pages/NotFound"; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/login" component={Loginpage} />
          <Route exact path="/register" component={Registerpage} />
          <PrivateRoute exact path="/tasks" component={TaskManager} />
          <Route path="/task/:id" component={TaskDetail} />
          <PrivateRoute exact path="/tasks/add" component={AddTask} /> 
          <PrivateRoute exact path="/tasks/statistics" component={TaskStatistics} /> k
          <Route component={NotFound} /> 
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
