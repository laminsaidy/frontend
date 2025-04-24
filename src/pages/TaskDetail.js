import React, { Component } from "react";
import axios from "axios";
import '../styles/components/Taskdetail.css';

class TaskDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: null,
      loading: true,
    };
  }

  componentDidMount() {
    const taskId = this.props.match.params.id;
    axios
      .get(`http://localhost:8000/api/tasks/${taskId}/`)
      .then((res) => {
        this.setState({ task: res.data, loading: false });
      })
      .catch((err) => console.error("Error fetching task details:", err));
  }

  handleBack = () => {
    // Navigate to the TaskManager page
    this.props.history.push("/tasks");
  };

  render() {
    const { task, loading } = this.state;
    if (loading) return <div>Loading...</div>;

    return (
      <div className="task-detail-container">
        <h2 className="task-detail-header">{task.title}</h2>
        <p className="task-detail-description"><strong>Description:</strong> {task.description}</p>
        <p className="task-detail-status"><strong>Status:</strong> {task.status}</p>
        <p className="task-detail-priority"><strong>Priority:</strong> {task.priority}</p>
        <p className="task-detail-category"><strong>Category:</strong> {task.category}</p>
        <p className="task-detail-due-date"><strong>Due Date:</strong> {task.due_date || "No due date"}</p>
        {task.overdue && (
          <p className="task-detail-overdue">
            <strong>Overdue!</strong>
          </p>
        )}

        {/* BACK button */}
        <button className="back-button" onClick={this.handleBack}>
          BACK
        </button>
      </div>
    );
  }
}

export default TaskDetail;
