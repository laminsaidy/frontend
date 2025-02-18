import React, { Component } from "react";
import axios from "axios";

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
      <div style={{ padding: "20px", marginTop: "80px" }}>
        <h2>{task.title}</h2>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Category:</strong> {task.category}</p>
        <p><strong>Due Date:</strong> {task.due_date || "No due date"}</p>
        {task.overdue && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            <strong>Overdue!</strong>
          </p>
        )}

        {/* BACK button */}
        <button
          onClick={this.handleBack}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          BACK
        </button>
      </div>
    );
  }
}

export default TaskDetail;