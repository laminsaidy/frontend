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

  // Status mappings
  const statusDisplayMap = {
    O: "Open",
    P: "In Progress",
    D: "Done",
    C: "Cancelled",
  };

  const statusCodeMap = {
    Open: "O",
    "In Progress": "P",
    Done: "D",
    Cancelled: "C",
  };

  const priorityMap = {
    Low: "L",
    Medium: "M",
    High: "H",
  };

  const toggle = () => {
    setModal(!modal);
    setValidationErrors({});
  };

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

  const editItem = (item) => {
    setActiveItem({
      ...item,
      due_date: item.due_date ? item.due_date.split("T")[0] : "",
    });
    setModal(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmationDialog(true);
  };

  const safeApiCall = useCallback(async (fn, errorMessage, retries = 3) => {
    try {
      setError(null);
      setValidationErrors({});
      return await fn();
    } catch (err) {
      if (err.name === "AbortError") {
        throw err;
      }

      if (err.code === "ERR_NETWORK" || !err.response) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return safeApiCall(fn, errorMessage, retries - 1);
        }
        setError(
          "Network Error: Unable to connect to server. Please check your connection."
        );
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

  const refreshList = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshTime.current < 2000) return;
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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const response = await safeApiCall(async () => {
        const res = await axiosInstance.get("/tasks/", {
          timeout: 10000,
          signal: abortControllerRef.current.signal,
        });

        const now = new Date();
        return res.data.map((task) => ({
          ...task,
          overdue:
            task.due_date &&
            new Date(task.due_date) < now &&
            task.status !== "D",
        }));
      }, "Failed to load tasks. Please try again.");

      setTaskList(response);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError("Failed to load tasks");
      }
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, isOnline, safeApiCall]);

  const formatPayload = (item) => {
    return {
      title: item.title.trim(),
      description: item.description?.trim() || "",
      status: statusCodeMap[item.status] || "O",
      priority: priorityMap[item.priority] || "M",
      category: item.category || "General",
      due_date: item.due_date || null,
    };
  };

  const handleSubmit = async (item) => {
    toggle();
    const payload = formatPayload(item);

    try {
      setLoading(true);
      if (item.id) {
        await safeApiCall(
          () => axiosInstance.put(`/tasks/${item.id}/`, payload),
          "Error updating task"
        );
      } else {
        await safeApiCall(
          () => axiosInstance.post("/tasks/", payload),
          "Error creating task"
        );
      }
      await refreshList();
    } catch (error) {
      if (error.response?.data) {
        const firstError = Object.values(error.response.data)[0];
        setError(
          firstError || "Failed to save task. Please check your inputs."
        );
      } else {
        setError("Failed to save task. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (item, newStatusDisplay) => {
    try {
      setLoading(true);

      const payload = formatPayload({
        ...item,
        status: newStatusDisplay,
      });

      await safeApiCall(
        () => axiosInstance.put(`/tasks/${item.id}/`, payload),
        "Error updating task status"
      );

      await refreshList();
    } catch (error) {
      console.error("Status update failed:", {
        request: error.config?.data,
        response: error.response?.data,
      });
      setError(
        error.response?.data?.detail ||
          "Failed to update task status. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setLoading(true);
      await safeApiCall(
        () => axiosInstance.delete(`/tasks/${itemToDelete.id}/`),
        "Error deleting task"
      );
      await refreshList();
    } finally {
      setShowConfirmationDialog(false);
      setItemToDelete(null);
      setLoading(false);
    }
  };

  const renderTabList = () => {
    const statuses = ["Open", "In Progress", "Done"];
    return (
      <div className="my-5 tab-list">
        {statuses.map((status) => (
          <span
            key={status}
            onClick={() => setViewStatus(status)}
            className={
              viewStatus === status
                ? `active ${status.toLowerCase().replace(" ", "-")}`
                : ""
            }
          >
            {status}
          </span>
        ))}
      </div>
    );
  };

  const renderItems = () => {
    const filteredItems = taskList.filter(
      (item) => statusDisplayMap[item.status] === viewStatus
    );

    if (filteredItems.length === 0) {
      return (
        <div className="no-tasks">
          No {viewStatus.toLowerCase()} tasks found
        </div>
      );
    }

    return filteredItems.map((item) => {
      const displayStatus = statusDisplayMap[item.status] || item.status;

      return (
        <div
          key={item.id}
          className={`task-card ${item.priority.toLowerCase()} ${
            item.overdue ? "overdue" : ""
          }`}
          onClick={() => (window.location.href = `/task/${item.id}`)}
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
                disabled={loading}
              >
                ✏️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
                className="btn-delete"
                disabled={loading}
              >
                🗑️
              </button>
              {displayStatus === "Open" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTaskStatus(item, "In Progress");
                  }}
                  className="btn-status"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "In Progress"}
                </button>
              )}
              {displayStatus === "In Progress" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTaskStatus(item, "Done");
                  }}
                  className="btn-status"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Done"}
                </button>
              )}
            </div>
          </div>

          <div className="task-meta">
            <span className={`priority-badge ${item.priority.toLowerCase()}`}>
              {item.priority}
            </span>
            <span
              className={`status-badge ${displayStatus
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {displayStatus}
            </span>
            <span className="task-category">{item.category}</span>
            {item.due_date && (
              <span className="task-due">
                📅 {new Date(item.due_date).toLocaleDateString()}
              </span>
            )}
          </div>

          {item.description && (
            <p className="task-description">{item.description}</p>
          )}
        </div>
      );
    });
  };

  // Network status effect
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      refreshList();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Copy the ref value to a local variable
    const currentTimeout = refreshTimeoutRef.current;

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      // Use the local variable in the cleanup function
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [refreshList]);

  // Initialization effect
  useEffect(() => {
    if (!initialized) {
      const fetchData = async () => {
        try {
          await refreshList();
          setInitialized(true);
        } catch (error) {
          if (error.name !== "AbortError") {
            setError("Failed to initialize");
          }
        }
      };
      fetchData();
    }
  }, [initialized, refreshList]);

  // Auto-refresh effect
  useEffect(() => {
    if (isOnline && initialized) {
      const intervalId = setInterval(refreshList, 30000);
      return () => clearInterval(intervalId);
    }
  }, [isOnline, initialized, refreshList]);

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

  if (loading && taskList.length === 0) {
    return <div className="loading-spinner">Loading tasks...</div>;
  }

  return (
    <main className="content">
      <h1 className="task-manager-header">Task Manager</h1>
      {error && (
        <div
          className={`alert ${
            error.includes("Network Error") ? "alert-warning" : "alert-danger"
          }`}
        >
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
              <strong>{field}:</strong>{" "}
              {Array.isArray(errors) ? errors.join(", ") : errors}
            </div>
          ))}
        </div>
      )}

      <div className="row">
        <div className="col-md-8 col-lg-6 mx-auto p-0">
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                onClick={createItem}
                className="btn btn-primary"
                disabled={loading}
              >
                + Add Task
              </button>
            </div>
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
        onCancel={() => setShowConfirmationDialog(false)}
        message="Are you sure you want to delete this task?"
      />
    </main>
  );
};

export default TaskManager;
