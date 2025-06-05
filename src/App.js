import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Navbar from './pages/Navbar';
import Homepage from './pages/Homepage';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import TaskManager from './pages/TaskManager';
import TaskDetail from './pages/TaskDetail';
import AddTask from './pages/AddTask';
import NotFound from './pages/NotFound';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ScrollToTop from './utils/ScrollToTop';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Navbar />
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/login" component={Loginpage} />
          <Route exact path="/register" component={Registerpage} />
          <PrivateRoute exact path="/tasks" component={TaskManager} />
          <Route path="/task/:id" component={TaskDetail} />
          <PrivateRoute exact path="/tasks/add" component={AddTask} />
          <Route exact path="/terms" component={TermsOfService} />
          <Route exact path="/privacy" component={PrivacyPolicy} />
          <Route component={NotFound} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
