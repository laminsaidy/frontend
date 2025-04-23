import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import '../styles/components/Homepage.css';

const Homepage = () => {
  const { user } = useContext(AuthContext);
  const [taskSummary, setTaskSummary] = useState({ open: 0, inProgress: 0, done: 0 });
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    // Fetch task summary and recent tasks
    axios.get("http://localhost:8000/api/tasks/summary/")
      .then(response => {
        setTaskSummary(response.data.summary);
        setRecentTasks(response.data.recentTasks);
      })
      .catch(error => {
        console.error("Error fetching task summary:", error);
      });
  }, []);

  return (
    <div>
      <main role="main" style={{ marginTop: 50 }}>
        {/* Main jumbotron for a primary marketing message or call to action */}
        <div className="jumbotron">
          <div className="container" style={{ marginTop: "80px", paddingBottom: "20px" }}>
            <h1 className="display-3">Welcome {user ? user.name : "Guest"}!</h1>
            <p>
              Manage your tasks efficiently with our Task Manager app.
            </p>
            <p>
              <Link to="/tasks" className="btn btn-primary btn-lg" role="button">
                View Tasks »
              </Link>
            </p>
          </div>
        </div>
        <div className="container">
          {/* Task Summary */}
          <div className="task-summary">
            <h2>Task Summary</h2>
            <div className="summary-item">
              <span className="summary-label">Open Tasks:</span>
              <span className="summary-value">{taskSummary.open}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">In Progress:</span>
              <span className="summary-value">{taskSummary.inProgress}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Completed Tasks:</span>
              <span className="summary-value">{taskSummary.done}</span>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="recent-tasks">
            <h2>Recent Tasks</h2>
            <ul>
              {recentTasks.map(task => (
                <li key={task.id}>
                  <Link to={`/task/${task.id}`}>{task.title}</Link>
                  <span className="task-date">{new Date(task.created_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr />

          {/* Example row of columns */}
          <div className="row">
            <div className="col-md-4">
              <h2>Inspirational Quote</h2>
              <p>
                "The best way to get something done is to begin. But the true secret? Break it down, track each step, and watch progress build momentum."
              </p>
            </div>
            <div className="col-md-4">
              <h2>Upcoming Tasks</h2>
              <p>
                Stay on top of your upcoming tasks.
              </p>
              <p>
                <Link to="/tasks?filter=upcoming" className="btn btn-secondary" role="button">
                  View Upcoming Tasks »
                </Link>
              </p>
            </div>
            <div className="col-md-4">
              <h2>Task Statistics</h2>
              <p>
                View detailed statistics about your tasks.
              </p>
              <p>
                <Link to="/tasks/statistics" className="btn btn-secondary" role="button">
                  View Statistics »
                </Link>
              </p>
            </div>
          </div>
        </div> {/* /container */}
      </main>
      <footer className="bg-light text-center text-lg-start">
        <div className="footer">
          <p>
            Copyright &copy; 2025; Designed by{" "}
            <span className="creator">
              <a href="https://github.com/laminsaidy" target="_blank" rel="noopener noreferrer">
                Lamin Saidy
              </a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
