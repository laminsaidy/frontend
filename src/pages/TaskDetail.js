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

    // Inline styles
    const styles = {
      container: {
        padding: "20px",
        marginTop: "80px", // Push content down to avoid being covered by Navbar
      },
      title: {
        border: "none",
        outline: "none",
        textDecoration: "none",
        paddingBottom: "10px",
      },
      paragraph: {
        marginBottom: "10px",
        fontSize: "1rem",
      },
      overdue: {
        color: "red",
        fontWeight: "bold",
      },
      navbarShadow: {
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        zIndex: "10",
        transition: "all 0.3s ease",
      },
      contentShift: {
        marginTop: "80px",
      },
    };

    return (
      <div style={styles.container}>
        <h2 style={styles.title}>{task.title}</h2>
        <p style={styles.paragraph}>
          <strong>Description:</strong> {task.description}
        </p>
        <p style={styles.paragraph}>
          <strong>Status:</strong> {task.status}
        </p>
        <p style={styles.paragraph}>
          <strong>Priority:</strong> {task.priority}
        </p>
        <p style={styles.paragraph}>
          <strong>Category:</strong> {task.category}
        </p>
        <p style={styles.paragraph}>
          <strong>Due Date:</strong> {task.due_date || "No due date"}
        </p>
        {task.overdue && (
          <p style={styles.overdue}>
            <strong>Overdue!</strong>
          </p>
        )}
      </div>
    );
  }
}

export default TaskDetail;
