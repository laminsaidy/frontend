import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [validationErrors, setValidationErrors] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const refreshTimeoutRef = useRef(null);
  const lastRefreshTime = useRef(0);
  const abortControllerRef = useRef(null);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Don't immediately refresh, let the effect below handle it
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Stable API call wrapper with network error handling
  const safeApiCall = useCallback(async (fn, errorMessage, retries = 3) => {
    try {
      setError(null);
      setValidationErrors({});

      const response = await fn();
      return response;
    } catch (err) {
      if (err.name === 'AbortError') {
        throw err; // Let the calling code handle abort errors
      }

      if (err.code === "ERR_NETWORK" || !err.response) {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return safeApiCall(fn, errorMessage, retries - 1);
        }
        setError("Network Error: Unable to connect to server. Please check your connection.");
      } else if (err.response?.status === 400) {
        setValidationErrors(err.response.data || {});
        setError("Validation error: Please check your inputs");
      } else if (err.response?.status >= 500) {
        setError("Server Error: Please try again later");
      } else {
        setError(errorMessage || "An unexpected error occurred");
      }

      throw err;
    }
  }, []);

  // Network-aware refresh function with timeout and rate limiting
  const refreshList = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshTime.current < 2000) { // 2 second cooldown
      return;
    }
    lastRefreshTime.current = now;

    if (!axiosInstance) {
      setError("API connection not configured");
      setLoading(false);
      return;
    }

    if (!isOnline) {
      setError("You are currently offline. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      await safeApiCall(
        async () => {
          const response = await axiosInstance.get("/tasks/", {
            timeout: 10000,
            signal: abortControllerRef.current.signal
          });

          const now = new Date();
          const tasksWithOverdue = response.data.map((task) => ({
            ...task,
            overdue: task.due_date &&
              new Date(task.due_date) < now &&
              task.status !== "Done",
          }));

          setTaskList(tasksWithOverdue);
          return response;
        },
        "Failed to load tasks. Please try again."
      );
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Refresh error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, isOnline, safeApiCall]);

  // Initial data load - runs only once
  useEffect(() => {
    if (!initialized) {
      const fetchData = async () => {
        try {
          await refreshList();
          setInitialized(true);
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error("Initialization error:", error);
          }
        }
      };

      fetchData();
    }
  }, [initialized, refreshList]);

  // Debounced auto-refresh when coming back online or when initialized changes
  useEffect(() => {
    if (isOnline && initialized) {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      refreshTimeoutRef.current = setTimeout(() => {
        refreshList();
      }, 500); // Small debounce to prevent rapid refreshes
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [isOnline, initialized, refreshList]);

  // Format payload for API with proper type conversion
  const formatPayload = (item) => {
    return {
      title: item.title.trim(),
      description: item.description?.trim() || "",
      status: item.status,
      priority: item.priority,
      category: Array.isArray(item.category) ? item.category[0] : (item.category || "General"),
      due_date: item.due_date || null
    };
  };

  // Handle save from modal (create or update)
  const handleSubmit = async (item) => {
    toggle();
    const payload = formatPayload(item);

    try {
      setLoading(true);
      if (item.id) {
        await safeApiCall(
          () => axiosInstance.put(`/tasks/${item.id}/`, payload, {
            timeout: 10000,
            signal: abortControllerRef.current?.signal
          }),
          "Error updating task"
        );
      } else {
        await safeApiCall(
          () => axiosInstance.post("/tasks/", payload, {
            timeout: 10000,
            signal: abortControllerRef.current?.signal
          }),
          "Error creating task"
        );
      }
      await refreshList();
    } catch (error) {
      // Error handling is done in safeApiCall
    } finally {
      setLoading(false);
    }
  };

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
    setActiveItem({
      ...item,
      due_date: item.due_date ? item.due_date.split('T')[0] : ""
    });
    setModal(true);
  };

  // Open confirmation dialog for deletion
  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmationDialog(true);
  };

  // Confirm deletion of a task
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setLoading(true);
      await safeApiCall(
        () => axiosInstance.delete(`/tasks/${itemToDelete.id}/`, {
          timeout: 10000,
          signal: abortControllerRef.current?.signal
        }),
        "Error deleting task"
      );
      setShowConfirmationDialog(false);
      setItemToDelete(null);
      await refreshList();
    } catch (error) {
      // Error handled in safeApiCall
    } finally {
      setLoading(false);
    }
  };

  // Cancel delete action
  const cancelDelete = () => {
    setShowConfirmationDialog(false);
    setItemToDelete(null);
  };

  // Update task status
  const updateTaskStatus = async (item, newStatus) => {
    const payload = { ...item, status: newStatus };
    try {
      setLoading(true);
      await safeApiCall(
        () => axiosInstance.put(`/tasks/${item.id}/`, payload, {
          timeout: 10000,
          signal: abortControllerRef.current?.signal
        }),
        "Error updating task status"
      );
      await refreshList();
    } catch (error) {
      // Error handled in safeApiCall
    } finally {
      setLoading(false);
    }
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

  if (!isOnline) {
    return (
      <div className="alert alert-warning">
        You're currently offline. Some features may not be available.
        <button className="btn btn-sm btn-primary ms-3" onClick={refreshList}>
          Retry Connection
        </button>
      </div>
    );
  }

  if (!initialized && error) {
    return <div className="error-message">Initialization error: {error}</div>;
  }

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <main className="content">
      <h1 className="task-manager-header">Task Manager</h1>
      {error && (
        <div className={`alert ${error.includes("Network Error") ? "alert-warning" : "alert-danger"}`}>
          {error}
          {error.includes("Network Error") && (
            <button
              className="btn btn-sm btn-primary ms-3"
              onClick={refreshList}
            >
              Retry
            </button>
          )}
          {Object.entries(validationErrors).map(([field, errors]) => (
            <div key={field}>
              <strong>{field}:</strong> {Array.isArray(errors) ? errors.join(", ") : errors}
            </div>
          ))}
        </div>
      )}

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
          errors={validationErrors}
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