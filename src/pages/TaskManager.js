import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import TaskModal from "./TaskModal";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/components/TaskManager.css";

const TaskManager = () => {
  const { api } = useContext(AuthContext);
  const navigate = useNavigate();
  const [viewStatus, setViewStatus] = useState("Open");
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    status: "Open",
    priority: "Medium",
    category: "General",
    due_date: "",
  });
  const [taskList, setTaskList] = useState([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const refreshList = useCallback(() => {
    setLoading(true);
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
        setTaskList(tasksWithOverdue);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        toast.error("Failed to load tasks");
        setTaskList([]);
        setLoading(false);
      });
  }, [api]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmit = (item) => {
    if (!item.title || !item.title.trim()) {
      toast.warning("Task title is required");
      return;
    }
    if (item.due_date && new Date(item.due_date) < new Date()) {
      toast.warning("Due date cannot be in the past");
      return;
    }

    toggle();

    // Build payload to send to backend
    const payload = {
      ...item,
      category: Array.isArray(item.category) ? item.category[0] : item.category,
      custom_category:
        item.category === "Other" ? item.custom_category || "" : "",
    };

    const request = item.id
      ? api.put(`/api/tasks/${item.id}/`, payload)
      : api.post("/api/tasks/", payload);

    request
      .then(() => {
        refreshList();
        toast.success("Task saved successfully");
      })
      .catch((error) => {
        console.error("Error saving task:", error);
        toast.error("Failed to save task");
      });
  };

  const handleDelete = (item) => {
    setShowConfirmationDialog(true);
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    api
      .delete(`/api/tasks/${itemToDelete.id}/`)
      .then(() => {
        refreshList();
        toast.success("Task deleted");
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      });
    setShowConfirmationDialog(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmationDialog(false);
    setItemToDelete(null);
  };

  const createItem = () => {
    const item = {
      title: "",
      description: "",
      status: "Open",
      priority: "Medium",
      category: "General",
      due_date: "",
    };
    setActiveItem(item);
    setModal(true);
  };

  const editItem = (item) => {
    setActiveItem(item);
    setModal(true);
  };

  const updateTaskStatus = (task, newStatus) => {
    const updatedTask = { ...task, status: newStatus };
    api
      .put(`/api/tasks/${task.id}/`, updatedTask)
      .then(() => {
        refreshList();
        toast.success("Task status updated");
      })
      .catch((error) => {
        console.error("Error updating task status:", error);
        toast.error("Failed to update task status");
      });
  };

  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  const renderItems = () => {
    const filteredTasks = taskList.filter((task) => task.status === viewStatus);
    if (filteredTasks.length === 0) {
      return (
        <div className="empty-state">
          <p>No tasks in this status.</p>
          {viewStatus === "Open" && (
            <button onClick={createItem} className="btn btn-primary">
              Create Your First Task
            </button>
          )}
        </div>
      );
    }
    return filteredTasks.map((task) => (
      <div
        key={task.id}
        className={`task-card ${
          task.overdue ? "overdue" : ""
        } ${task.priority.toLowerCase()}`}
        onClick={() => handleTaskClick(task.id)}
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
          <span
            className={`status-badge ${task.status
              .replace(" ", "-")
              .toLowerCase()}`}
          >
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
          <button
            className="btn-edit"
            onClick={(e) => {
              e.stopPropagation();
              editItem(task);
            }}
          >
            ✏️ Edit
          </button>
          <button
            className="btn-delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(task);
            }}
          >
            🗑️ Delete
          </button>
        </div>
        <div className="task-status-controls">
          {task.status === "Open" && (
            <button
              className="btn-move-progress"
              onClick={(e) => {
                e.stopPropagation();
                updateTaskStatus(task, "In Progress");
              }}
            >
              Move to Progress
            </button>
          )}
          {task.status === "In Progress" && (
            <button
              className="btn-mark-done"
              onClick={(e) => {
                e.stopPropagation();
                updateTaskStatus(task, "Done");
              }}
            >
              Mark as Done
            </button>
          )}
        </div>
      </div>
    ));
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="task-manager-wrapper">
      <Helmet>
        <title>Task Manager | TaskManager</title>
        <meta
          name="description"
          content="Manage and organize all your tasks in one place"
        />
      </Helmet>
      <ErrorBoundary>
        <main className="task-manager-container">
          <div className="task-manager-header">
            <h1>Task Manager</h1>
            <button onClick={createItem} className="btn btn-primary">
              ＋ Add New Task
            </button>
          </div>
          <div className="status-tabs">
            {["Open", "In Progress", "Done"].map((status) => (
              <button
                key={status}
                className={`tab-btn ${viewStatus === status ? "active" : ""}`}
                onClick={() => setViewStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="task-list-container">{renderItems()}</div>
          {modal && (
            <TaskModal
              activeItem={activeItem}
              toggle={toggle}
              onSave={handleSubmit}
            />
          )}
          {showConfirmationDialog && (
            <ConfirmationDialog
              show={showConfirmationDialog}
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
              message="Are you sure you want to delete this task?"
            />
          )}
        </main>
      </ErrorBoundary>
    </div>
  );
};

const TaskManagerWithAuth = (props) => (
  <AuthContext.Consumer>
    {({ api }) => <TaskManager {...props} api={api} />}
  </AuthContext.Consumer>
);

export default TaskManagerWithAuth;
