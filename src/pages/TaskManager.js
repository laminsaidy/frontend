import React, { Component } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from 'react-toastify';
import { AuthContext } from "../context/AuthContext";
import TaskModal from "../components/TaskModal";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/components/TaskManager.css";

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
    this.setState({ loading: true });
    this.props.api
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
        toast.error("Failed to load tasks");
        this.setState({ taskList: [], loading: false });
      });
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    if (!item.title || !item.title.trim()) {
      toast.warning("Task title is required");
      return;
    }
    if (item.due_date && new Date(item.due_date) < new Date()) {
      toast.warning("Due date cannot be in the past");
      return;
    }

    this.toggle();
    const payload = {
      ...item,
      category: Array.isArray(item.category) ? item.category[0] : item.category,
    };

    const request = item.id
      ? this.props.api.put(`/api/tasks/${item.id}/`, payload)
      : this.props.api.post("/api/tasks/", payload);

    request
      .then(() => {
        this.refreshList();
        toast.success("Task saved successfully");
      })
      .catch((error) => {
        console.error("Error saving task:", error);
        toast.error("Failed to save task");
      });
  };

  handleDelete = (item) => {
    this.setState({ showConfirmationDialog: true, itemToDelete: item });
  };

  confirmDelete = () => {
    const { itemToDelete } = this.state;
    this.props.api
      .delete(`/api/tasks/${itemToDelete.id}/`)
      .then(() => {
        this.refreshList();
        toast.success("Task deleted");
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      });
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

  updateTaskStatus = (task, newStatus) => {
    const updatedTask = { ...task, status: newStatus };
    this.props.api
      .put(`/api/tasks/${task.id}/`, updatedTask)
      .then(() => {
        this.refreshList();
        toast.success("Task status updated");
      })
      .catch((error) => {
        console.error("Error updating task status:", error);
        toast.error("Failed to update task status");
      });
  };

  renderItems = () => {
    const { taskList, viewStatus } = this.state;
    const filteredTasks = taskList.filter((task) => task.status === viewStatus);

    if (filteredTasks.length === 0) {
      return (
        <div className="empty-state">
          <p>No tasks in this status.</p>
          {viewStatus === "Open" && (
            <button onClick={this.createItem} className="btn btn-primary">
              Create Your First Task
            </button>
          )}
        </div>
      );
    }

    return filteredTasks.map((task) => (
      <div
        key={task.id}
        className={`task-card ${task.overdue ? "overdue" : ""} ${task.priority.toLowerCase()}`}
      >
        <div className="task-card-header">
          <h5 className="task-title">{task.title}</h5>
          {task.overdue && <span className="overdue-badge">Overdue</span>}
        </div>
        <div className="task-description">{task.description}</div>
        <div className="task-meta">
          <span className={`priority-badge ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          <span className={`status-badge ${task.status.replace(" ", "-").toLowerCase()}`}>
            {task.status}
          </span>
          <span className="task-category">{task.category}</span>
          <span className="task-due">
            Due:{" "}
            <span className={task.overdue ? "overdue-text" : ""}>
              {task.due_date || "No due date"}
            </span>
          </span>
        </div>
        <div className="task-actions">
          <button className="btn-edit" onClick={() => this.editItem(task)}>
            ✏️ Edit
          </button>
          <button className="btn-delete" onClick={() => this.handleDelete(task)}>
            🗑️ Delete
          </button>
        </div>
        <div className="task-status-controls">
          {task.status === "Open" && (
            <button 
              className="btn-move-progress" 
              onClick={() => this.updateTaskStatus(task, "In Progress")}
            >
              Move to Progress
            </button>
          )}
          {task.status === "In Progress" && (
            <button 
              className="btn-mark-done" 
              onClick={() => this.updateTaskStatus(task, "Done")}
            >
              Mark as Done
            </button>
          )}
        </div>
      </div>
    ));
  };

  render() {
    const { loading, showConfirmationDialog, viewStatus } = this.state;

    if (loading) {
      return <LoadingSpinner fullPage />;
    }

    return (
      <div className="task-manager-wrapper">
        <Helmet>
          <title>Task Manager | TaskManager</title>
          <meta name="description" content="Manage and organize all your tasks in one place" />
        </Helmet>

        <ErrorBoundary>
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
                  className={`tab-btn ${viewStatus === status ? "active" : ""}`}
                  onClick={() => this.setState({ viewStatus: status })}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="task-list-container">
              {this.renderItems()}
            </div>

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
        </ErrorBoundary>
      </div>
    );
  }
}

const TaskManagerWithAuth = (props) => (
  <AuthContext.Consumer>
    {({ api }) => <TaskManager {...props} api={api} />}
  </AuthContext.Consumer>
);

export default TaskManagerWithAuth;