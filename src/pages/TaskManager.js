import React, { useState, useEffect, useCallback } from "react";
import useAxios from "../utils/useAxios";
import ConfirmationDialog from "../context/ConfirmationDialog";
import TaskModal from "../context/TaskModal";
import "../styles/components/TaskManager.css";

const TaskManager = () => {
  const axiosInstance = useAxios();
  const [initialized, setInitialized] = useState(false);
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
  const [error, setError] = useState(null);

  // Safe API call wrapper
  const safeApiCall = async (fn, errorMessage) => {
    try {
      setError(null);
      return await fn();
    } catch (err) {
      console.error(errorMessage, err);
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const refreshList = useCallback(() => {
    if (!axiosInstance) {
      setError("API connection not available");
      setLoading(false);
      return;
    }

    safeApiCall(
      () =>
        axiosInstance.get("/tasks/").then((res) => {
          const tasksWithOverdue = res.data.map((task) => ({
            ...task,
            overdue:
              task.due_date &&
              new Date(task.due_date) < new Date() &&
              task.status !== "Done",
          }));
          setTaskList(tasksWithOverdue);
          setLoading(false);
        }),
      "Error fetching tasks"
    );
  }, [axiosInstance]);

  useEffect(() => {
    refreshList();
    setInitialized(true);
  }, [refreshList]);

  // Open modal to create a new task
  const createItem = () => {
    setActiveItem({
      title: "",
      description: "",
      status: "Open",
      priority: "Medium",
      category: "General",
      due_date: "",
    });
    setModal(true);
  };

  // Toggle the task modal
  const toggle = () => {
    setModal(!modal);
  };

  // Edit an existing task
  const editItem = (item) => {
    setActiveItem(item);
    setModal(true);
  };

  // Handle save from modal (create or update)
  const handleSubmit = (item) => {
    toggle();
    const payload = {
      ...item,
      category: Array.isArray(item.category) ? item.category[0] : item.category,
    };

    if (item.id) {
      // Update existing task
      safeApiCall(
        () => axiosInstance.put(`/tasks/${item.id}/`, payload),
        "Error updating task"
      ).then(refreshList);
    } else {
      // Create new task
      safeApiCall(
        () => axiosInstance.post("/tasks/", payload),
        "Error creating task"
      ).then(refreshList);
    }
  };

  // Open confirmation dialog for deletion
  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmationDialog(true);
  };

  // Confirm deletion of a task
  const confirmDelete = () => {
    if (!itemToDelete) return;
    safeApiCall(
      () => axiosInstance.delete(`/tasks/${itemToDelete.id}/`),
      "Error deleting task"
    ).then(() => {
      setShowConfirmationDialog(false);
      setItemToDelete(null);
      refreshList();
    });
  };

  // Cancel delete action
  const cancelDelete = () => {
    setShowConfirmationDialog(false);
    setItemToDelete(null);
  };

  // Update task status
  const updateTaskStatus = (item, newStatus) => {
    const payload = { ...item, status: newStatus };
    safeApiCall(
      () => axiosInstance.put(`/tasks/${item.id}/`, payload),
      "Error updating task status"
    ).then(refreshList);
  };

  // Tab navigation (Open / In Progress / Done)
  const renderTabList = () => {
    const statuses = ["Open", "In Progress", "Done"];
    return (
      <div className="my-5 tab-list">
        {statuses.map((status) => (
          <span
            key={status}
            onClick={() => setViewStatus(status)}
            className={viewStatus === status ? `active ${status.toLowerCase().replace(' ', '-')}` : ''}
          >
            {status}
          </span>
        ))}
      </div>
    );
  };

  // Render tasks filtered by status
  const renderItems = () => {
    const filteredItems = taskList.filter((item) => item.status === viewStatus);

    return filteredItems.map((item) => (
      <div
        key={item.id}
        className={`task-card ${item.priority.toLowerCase()} ${item.overdue ? 'overdue' : ''}`}
        onClick={() => window.history.pushState({}, '', `/task/${item.id}`)}
      >
        <div className="task-card-header">
          <h3 className="task-title">
            {item.title}
            {item.overdue && <span className="overdue-badge">OVERDUE</span>}
          </h3>
          <div className="task-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                editItem(item);
              }}
              className="btn-edit"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item);
              }}
              className="btn-delete"
            >
              🗑️
            </button>
            {viewStatus === "Open" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateTaskStatus(item, "In Progress");
                }}
                className="btn-status"
              >
                In Progress
              </button>
            )}
            {viewStatus === "In Progress" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateTaskStatus(item, "Done");
                }}
                className="btn-status"
              >
                Done
              </button>
            )}
          </div>
        </div>

        <div className="task-meta">
          <span className={`priority-badge ${item.priority.toLowerCase()}`}>
            {item.priority}
          </span>
          <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
            {item.status}
          </span>
          <span className="task-category">
            {item.category}
          </span>
          {item.due_date && (
            <span className="task-due">
              📅 {new Date(item.due_date).toLocaleDateString()}
            </span>
          )}
        </div>

        {item.description && (
          <p className="task-description">
            {item.description}
          </p>
        )}
      </div>
    ));
  };

  // Add this early return if initialization fails
  if (!initialized && error) {
    return <div className="error-message">Initialization error: {error}</div>;
  }

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <main className="content">
      <h1 className="task-manager-header">Task Manager</h1>
      <div className="row">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <button onClick={createItem} className="btn btn-primary">
              Add task
            </button>
            {renderTabList()}
            <div className="task-list-container">{renderItems()}</div>
          </div>
        </div>
      </div>
      {modal && (
        <TaskModal
          activeItem={activeItem}
          toggle={toggle}
          onSave={handleSubmit}
        />
      )}
      <ConfirmationDialog
        show={showConfirmationDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this task?"
      />
    </main>
  );
};

export default TaskManager;