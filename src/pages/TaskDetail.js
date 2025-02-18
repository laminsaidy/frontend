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

  render() {
    const { task, loading } = this.state;
    if (loading) return <div>Loading...</div>;

    return (
      <div style={{ padding: "20px", marginTop: "80px" }}>
        {/* Add debugging styles */}
        <h2
          style={{
            border: "none",
            outline: "none",
            textDecoration: "none",
            borderBottom: "none", // Only one borderBottom property
            paddingBottom: "10px",
            backgroundColor: "yellow", // Temporary debug style
          }}
        >
          {task.title}
        </h2>
        <p style={{ marginBottom: "10px", fontSize: "1rem" }}>
          <strong>Description:</strong> {task.description}
        </p>
        <p style={{ marginBottom: "10px", fontSize: "1rem" }}>
          <strong>Status:</strong> {task.status}
        </p>
        <p style={{ marginBottom: "10px", fontSize: "1rem" }}>
          <strong>Priority:</strong> {task.priority}
        </p>
        <p style={{ marginBottom: "10px", fontSize: "1rem" }}>
          <strong>Category:</strong> {task.category}
        </p>
        <p style={{ marginBottom: "10px", fontSize: "1rem" }}>
          <strong>Due Date:</strong> {task.due_date || "No due date"}
        </p>
        {task.overdue && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            <strong>Overdue!</strong>
          </p>
        )}
      </div>
    );
  }
}

export default TaskDetail;