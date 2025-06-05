import React, { useState, useEffect, useCallback, useRef } from 'react';
import useAxios from '../utils/useAxios';
import ConfirmationDialog from '../context/ConfirmationDialog';
import TaskModal from '../context/TaskModal';
import '../styles/components/TaskManager.css';

const TaskManager = () => {
  const axiosInstance = useAxios();
  const [initialized, setInitialized] = useState(false);
  const [viewStatus, setViewStatus] = useState('Open');
  const [activeItem, setActiveItem] = useState({
    title: '',
    description: '',
    status: 'Open',
    priority: 'Medium',
    category: 'General',
    due_date: '',
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
  const isMountedRef = useRef(false);

  // Status mappings
  const statusDisplayMap = {
    O: 'Open',
    P: 'In Progress',
    D: 'Done',
    C: 'Cancelled',
  };

  const statusCodeMap = {
    Open: 'O',
    'In Progress': 'P',
    Done: 'D',
    Cancelled: 'C',
  };

  const priorityMap = {
    Low: 'L',
    Medium: 'M',
    High: 'H',
  };

  // Custom hook for debouncing
  const useDebounce = (callback, delay) => {
    const timeoutRef = useRef();

    return useCallback(
      (...args) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args);
        }, delay);
      },
      [callback, delay]
    );
  };

  const toggle = () => {
    setModal(!modal);
    setValidationErrors({});
  };

  const createItem = () => {
    setActiveItem({
      title: '',
      description: '',
      status: 'Open',
      priority: 'Medium',
      category: 'General',
      due_date: '',
    });
    setModal(true);
  };

  const editItem = (item) => {
    setActiveItem({
      ...item,
      due_date: item.due_date ? item.due_date.split('T')[0] : '',
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
      if (err.name === 'AbortError') {
        throw err;
      }

      if (err.code === 'ERR_NETWORK' || !err.response) {
        if (retries > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, 2000 * (3 - retries))
          ); // Exponential backoff
          return safeApiCall(fn, errorMessage, retries - 1);
        }
        setError(
          'Network Error: Unable to connect to server. Please check your connection.'
        );
        throw new Error('Network Error');
      } else if (err.response?.status === 400) {
        setValidationErrors(err.response.data || {});
        setError('Validation error: Please check your inputs');
        throw new Error('Validation Error');
      } else if (err.response?.status >= 500) {
        setError('Server Error: Please try again later');
        throw new Error('Server Error');
      } else {
        setError(errorMessage || 'An unexpected error occurred');
        throw new Error(errorMessage || 'Unexpected Error');
      }
    }
  }, []);

  const refreshList = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshTime.current < 5000) return; // Increased debounce time
    lastRefreshTime.current = now;

    if (!axiosInstance) {
      setError('API connection not configured');
      setLoading(false);
      return;
    }

    if (!isOnline) {
      setError('You are currently offline. Please check your connection.');
      setLoading(false);
      return;
    }

    if (loading) return; // Skip if already loading

    try {
      setLoading(true);
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort('New request initiated');
      }

      // Create new abort controller with timeout
      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        abortControllerRef.current.abort('Request timeout');
      }, 10000);

      const response = await safeApiCall(async () => {
        try {
          const res = await axiosInstance.get('/tasks/', {
            signal: abortControllerRef.current.signal,
            timeout: 15000, // Increased timeout
          });
          clearTimeout(timeoutId);

          const now = new Date();
          return res.data.map((task) => ({
            ...task,
            overdue:
              task.due_date &&
              new Date(task.due_date) < now &&
              task.status !== 'D',
          }));
        } catch (err) {
          clearTimeout(timeoutId);
          throw err;
        }
      }, 'Failed to load tasks. Please try again.');

      if (isMountedRef.current) {
        setTaskList(response);
        setError(null);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted:', error.message);
        return;
      }
      if (
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error')
      ) {
        setError(
          'Network Error: Unable to connect to server. Please check your connection.'
        );
      } else if (isMountedRef.current) {
        setError('Failed to load tasks. Please try again later.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [axiosInstance, isOnline, safeApiCall, loading]);

  const debouncedRefreshList = useDebounce(refreshList, 1000);

  const formatPayload = (item) => {
    return {
      title: item.title.trim(),
      description: item.description?.trim() || '',
      status: statusCodeMap[item.status] || 'O',
      priority: priorityMap[item.priority] || 'M',
      category: item.category || 'General',
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
          'Error updating task'
        );
      } else {
        await safeApiCall(
          () => axiosInstance.post('/tasks/', payload),
          'Error creating task'
        );
      }
      await debouncedRefreshList();
    } catch (error) {
      if (error.response?.data) {
        const firstError = Object.values(error.response.data)[0];
        setError(
          firstError || 'Failed to save task. Please check your inputs.'
        );
      } else {
        setError('Failed to save task. Please try again.');
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
        'Error updating task status'
      );

      await debouncedRefreshList();
    } catch (error) {
      console.error('Status update failed:', {
        request: error.config?.data,
        response: error.response?.data,
      });
      setError(
        error.response?.data?.detail ||
          'Failed to update task status. Please try again.'
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
        'Error deleting task'
      );
      await debouncedRefreshList();
    } finally {
      setShowConfirmationDialog(false);
      setItemToDelete(null);
      setLoading(false);
    }
  };

  const renderTabList = () => {
    const statuses = ['Open', 'In Progress', 'Done'];
    return (
      <div className="my-5 tab-list">
        {statuses.map((status) => (
          <span
            key={status}
            onClick={() => setViewStatus(status)}
            className={
              viewStatus === status
                ? `active ${status.toLowerCase().replace(' ', '-')}`
                : ''
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
            item.overdue ? 'overdue' : ''
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
              {displayStatus === 'Open' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTaskStatus(item, 'In Progress');
                  }}
                  className="btn-status"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'In Progress'}
                </button>
              )}
              {displayStatus === 'In Progress' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTaskStatus(item, 'Done');
                  }}
                  className="btn-status"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Done'}
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
                .replace(' ', '-')}`}
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

  // Mount/unmount effect
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Network status effect
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      debouncedRefreshList();
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort('Network offline');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [debouncedRefreshList]);

  // Initialization effect
  useEffect(() => {
    if (!initialized) {
      const fetchData = async () => {
        try {
          await debouncedRefreshList();
          if (isMountedRef.current) {
            setInitialized(true);
          }
        } catch (error) {
          if (error.name !== 'AbortError' && isMountedRef.current) {
            setError('Failed to initialize');
          }
        }
      };
      fetchData();
    }
  }, [initialized, debouncedRefreshList]);

  // Auto-refresh effect
  useEffect(() => {
    if (isOnline && initialized) {
      const intervalId = setInterval(() => {
        if (document.visibilityState === 'visible') {
          debouncedRefreshList();
        }
      }, 60000); // Increased interval to 60 seconds

      // Refresh when tab becomes visible
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          debouncedRefreshList();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(intervalId);
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
      };
    }
  }, [isOnline, initialized, debouncedRefreshList]);

  if (!isOnline) {
    return (
      <div className="alert alert-warning">
        You're currently offline. Some features may not be available.
        <button
          className="btn btn-sm btn-primary ms-3"
          onClick={debouncedRefreshList}
        >
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
            error.includes('Network Error') ? 'alert-warning' : 'alert-danger'
          }`}
        >
          {error}
          {error.includes('Network Error') && (
            <button
              className="btn btn-sm btn-primary ms-3"
              onClick={debouncedRefreshList}
            >
              Retry
            </button>
          )}
          {Object.entries(validationErrors).map(([field, errors]) => (
            <div key={field}>
              <strong>{field}:</strong>{' '}
              {Array.isArray(errors) ? errors.join(', ') : errors}
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
