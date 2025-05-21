import React, { Component } from "react";
import axios from "axios";
import '../styles/components/Taskdetail.css';
import { getCSRFToken } from "../utils/csrf";

class TaskDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: null,
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    const taskId = this.props.match.params.id;
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/todos/${taskId}/`, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': getCSRFToken()
        }
      })
      .then((res) => {
        this.setState({ 
          task: res.data, 
          loading: false 
        });
      })
      .catch((err) => {
        console.error("Error fetching task details:", err);
        this.setState({ 
          error: "Failed to load task details", 
          loading: false 
        });
      });
  }

  handleBack = () => {
    this.props.history.push("/tasks");
  };

  render() {
    const { task, loading, error } = this.state;
    
    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!task) return <div className="error-message">Task not found</div>;

    return (
      <div className="task-detail-container">
        <h2 className="task-detail-header">{task.title}</h2>
        <p className="task-detail-description"><strong>Description:</strong> {task.description || "No description"}</p>
        <p className="task-detail-status"><strong>Status:</strong> {task.status_display}</p>
        <p className="task-detail-priority"><strong>Priority:</strong> {task.priority_display}</p>
        <p className="task-detail-category"><strong>Category:</strong> {task.category || "General"}</p>
        <p className="task-detail-due-date">
          <strong>Due Date:</strong> {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
        </p>
        {task.overdue && (
          <p className="task-detail-overdue">
            <strong>Overdue!</strong>
          </p>
        )}

        <button className="back-button" onClick={this.handleBack}>
          BACK
        </button>
      </div>
    );
  }
}

export default TaskDetail;