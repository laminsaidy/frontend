import React, { Component } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import TaskModal from "../components/TaskModal";
import ConfirmationDialog from "../context/ConfirmationDialog";
import "../styles/components/TaskManager.css";

const api = axios.create({
  baseURL: "http://127.0.0.1:8081",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

class TaskManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewStatus: "Open",
      activeItem: {
        title: "",
        description: "",
        status: "Open",
        priority: "Medium",
        category: "General",
        due_date: "",
      },
      taskList: [],
      modal: false,
      loading: true,
      showConfirmationDialog: false,
      itemToDelete: null,
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    api.get("/api/tasks/").then((res) => {
      const tasksWithOverdue = res.data.map((task) => ({
        ...task,
        overdue:
          task.due_date &&
          new Date(task.due_date) < new Date() &&
          task.status !== "Done",
      }));
      this.setState({ taskList: tasksWithOverdue, loading: false });
    }).catch((err) => {
      console.error("Error fetching tasks:", err);
      this.setState({ taskList: [], loading: false });
    });
  };

  // Other methods...

  render() {
    const { loading, showConfirmationDialog, viewStatus } = this.state;

    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      );
    }

    return (
      <div className="task-manager-wrapper">
        <Helmet>
          <title>Task Manager</title>
          <meta name="description" content="Manage your tasks efficiently." />
        </Helmet>
        <main className="task-manager-container">
          {/* Task manager content */}
        </main>
      </div>
    );
  }
}

export default TaskManager;
