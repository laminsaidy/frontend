import React, { Component } from "react";
import axios from "axios";
import TaskModal from "../components/TaskModal";
import ConfirmationDialog from "../context/ConfirmationDialog";
import "../styles/components/TaskManager.css";

// Correct local API base URL
const api = axios.create({
  baseURL: "http://127.0.0.1:8081",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
    api
      .get("/api/tasks/")
      .then((res) => {
        const tasksWithOverdue = res.data.map((task) => ({
          ...task,
          overdue:
            task.due_date &&
            new Date(task.due_date) < new Date() &&
            task.status !== "Done",
        }));
        this.setState({ taskList: tasksWithOverdue, loading: false });
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        this.setState({ taskList: [], loading: false });
      });
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();
    const payload = {
      ...item,
      category: Array.isArray(item.category)
        ? item.category[0]
        : item.category,
    };

    if (item.id) {
      api
        .put(`/api/tasks/${item.id}/`, payload)
        .then(this.refreshList)
        .catch((error) =>
          console.error("Error updating task:", error.response?.data || error)
        );
      return;
    }

    api
      .post("/api/tasks/", payload)
      .then(this.refreshList)
      .catch((error) =>
        console.error("Error creating task:", error.response?.data || error)
      );
  };

  handleDelete = (item) => {
    this.setState({ showConfirmationDialog: true, itemToDelete: item });
  };

  confirmDelete = () => {
    const { itemToDelete } = this.state;
    api
      .delete(`/api/tasks/${itemToDelete.id}/`)
      .then(this.refreshList)
      .catch((error) =>
        console.error("Error deleting task:", error.response?.data || error)
      );
    this.setState({ showConfirmationDialog: false, itemToDelete: null });
  };

  cancelDelete = () => {
    this.setState({ showConfirmationDialog: false, itemToDelete: null });
  };

  createItem = () => {
    const item = {
      title: "",
      description: "",
      status: "Open",
      priority: "Medium",
      category: "General",
      due_date: "",
    };
    this.setState({ activeItem: item, modal: true });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: true });
  };

  updateTaskStatus = (item, newStatus) => {
    const payload = { ...item, status: newStatus };
    api
      .put(`/api/tasks/${item.id}/`, payload)
      .then(this.refreshList)
      .catch((error) =>
        console.error("Error updating status:", error.response?.data || error)
      );
  };

  renderItems = () => {
    const { viewStatus, taskList } = this.state;
    const filteredItems = taskList.filter((item) => item.status === viewStatus);

    if (filteredItems.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No {viewStatus.toLowerCase()} tasks</h3>
          <p>You're all caught up!</p>
          {viewStatus === "Open" && (
            <button onClick={this.createItem} className="btn btn-primary">
              Create First Task
            </button>
          )}
        </div>
      );
    }

    return filteredItems.map((item) => (
      <div
        key={item.id}
        className={`task-card ${item.priority.toLowerCase()} ${
          item.overdue ? "overdue" : ""
        }`}
        onClick={() => this.props.history.push(`/task/${item.id}`)}
      >
        <div className="task-card-header">
          <h3>{item.title}</h3>
          {item.overdue && <span className="overdue-badge">OVERDUE</span>}
          <div className="task-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                this.editItem(item);
              }}
              className="btn-icon"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                this.handleDelete(item);
              }}
              className="btn-icon"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="task-meta">
          <span className={`badge priority ${item.priority.toLowerCase()}`}>
            {item.priority}
          </span>
          <span
            className={`badge status ${item.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {item.status}
          </span>
          <span className="badge category">{item.category}</span>
        </div>

        {item.description && (
          <p className="task-description">{item.description}</p>
        )}

        {item.due_date && (
          <div className="task-due-date">
            <span className={item.overdue ? "overdue-text" : ""}>
              📅 {new Date(item.due_date).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="status-buttons">
          {item.status === "Open" && (
            <button
              className="btn-status"
              onClick={(e) => {
                e.stopPropagation();
                this.updateTaskStatus(item, "In Progress");
              }}
            >
              ▶ Move to In Progress
            </button>
          )}
          {item.status === "In Progress" && (
            <button
              className="btn-status"
              onClick={(e) => {
                e.stopPropagation();
                this.updateTaskStatus(item, "Done");
              }}
            >
              ✔ Move to Done
            </button>
          )}
        </div>
      </div>
    ));
  };

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
        <main className="task-manager-container">
          <div className="task-manager-header">
            <h1>Task Manager</h1>
            <button onClick={this.createItem} className="btn btn-primary">
              ＋ Add New Task
            </button>
          </div>

          <div className="status-tabs">
            {["Open", "In Progress", "Done"].map((status) => (
              <button
                key={status}
                className={`tab-btn ${
                  viewStatus === status ? "active" : ""
                }`}
                onClick={() => this.setState({ viewStatus: status })}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="task-list-container">{this.renderItems()}</div>

          {this.state.modal && (
            <TaskModal
              activeItem={this.state.activeItem}
              toggle={this.toggle}
              onSave={this.handleSubmit}
            />
          )}

          {showConfirmationDialog && (
            <ConfirmationDialog
              show={showConfirmationDialog}
              onConfirm={this.confirmDelete}
              onCancel={this.cancelDelete}
              message="Are you sure you want to delete this task?"
            />
          )}
        </main>
      </div>
    );
  }
}

export default TaskManager;
