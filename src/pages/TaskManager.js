import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from 'lodash';
import TaskModal from "../components/TaskModal";
import ConfirmationDialog from "../context/ConfirmationDialog";
import '../styles/components/TaskManager.css';
import AuthContext from "../context/AuthContext";

const TaskManager = () => {
  const { api, user } = useContext(AuthContext);
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

  const refreshList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/tasks/", { params: { page: 1, page_size: 10 } });
      if (response.data && response.data.length > 0) {
        const tasksWithOverdue = response.data.map((task) => ({
          ...task,
          overdue: task.due_date && new Date(task.due_date) < new Date() && task.status !== "Done",
        }));
        setTaskList(tasksWithOverdue);
      } else {
        setTaskList([]);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [api, navigate]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    refreshList();
  }, [user, navigate, refreshList]);

  const handleSubmit = async (item) => {
    setModal(false);
    try {
      const payload = {
        ...item,
        category: Array.isArray(item.category) ? item.category[0] : item.category,
      };

      if (item.id) {
        await api.put(`/api/tasks/${item.id}/`, payload);
      } else {
        await api.post("/api/tasks/", payload);
      }
      refreshList();
    } catch (error) {
      console.error('Task operation failed:', error);
    }
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
    setActiveItem(item);
    setModal(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmationDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/tasks/${itemToDelete.id}/`);
      refreshList();
    } catch (error) {
      console.error('Deletion failed:', error);
    } finally {
      setShowConfirmationDialog(false);
    }
  };

  const renderItems = () => {
    const filteredTasks = taskList.filter((task) => task.status === viewStatus);

    if (filteredTasks.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No {viewStatus.toLowerCase()} tasks</h3>
          <p>You're all caught up or ready to get started!</p>
          {viewStatus === "Open" && (
            <button
              onClick={createItem}
              className="btn btn-primary"
            >
              Create Your First Task
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="task-grid">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${task.priority.toLowerCase()} ${task.overdue ? 'overdue' : ''}`}
            onClick={() => navigate(`/task/${task.id}`)}
          >
            <div className="task-card-header">
              <h3>{task.title}</h3>
              <div className="task-actions">
                <button
                  className="btn btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    editItem(task);
                  }}
                  aria-label="Edit task"
                >
                  ✏️
                </button>
                <button
                  className="btn btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(task);
                  }}
                  aria-label="Delete task"
                >
                  🗑️
                </button>
              </div>
            </div>
            <p className="task-description">
              {task.description || <span className="no-description">No description</span>}
            </p>
            <div className="task-meta">
              <div className="task-tags">
                <span className={`badge status ${task.status.toLowerCase().replace(' ', '-')}`}>
                  {task.status}
                </span>
                <span className={`badge priority ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
              <div className="task-due-date">
                {task.due_date ? (
                  <>
                    <span className={task.overdue ? 'overdue-text' : ''}>
                      📅 {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  </>
                ) : (
                  <span className="no-due-date">No due date</span>
                )}
              </div>
            </div>
            {task.overdue && (
              <div className="overdue-banner">OVERDUE</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleResize = debounce(() => {
    // Handle resize event
  }, 250);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="task-manager-wrapper">
      <main className="task-manager-container">
        <div className="task-manager-header">
          <div className="header-content">
            <h1>Task Manager</h1>
            <p>Stay organized and productive</p>
          </div>
          <div className="header-controls">
            <div className="user-info">
              👋 Welcome, <strong>{user?.username}</strong>
            </div>
            <button
              onClick={createItem}
              className="btn btn-primary add-task-btn"
            >
              ＋ Add New Task
            </button>
          </div>
        </div>

        <div className="status-tabs">
          {["Open", "In Progress", "Done"].map((status) => (
            <button
              key={status}
              className={`tab-btn ${viewStatus === status ? 'active' : ''}`}
              onClick={() => setViewStatus(status)}
            >
              {status}
              <span className="task-count">
                ({taskList.filter(t => t.status === status).length})
              </span>
            </button>
          ))}
        </div>

        <div className="task-list-container">
          {renderItems()}
        </div>

        {modal && (
          <TaskModal
            activeItem={activeItem}
            toggle={() => setModal(false)}
            onSave={handleSubmit}
          />
        )}

        {showConfirmationDialog && (
          <ConfirmationDialog
            show={showConfirmationDialog}
            onConfirm={confirmDelete}
            onCancel={() => setShowConfirmationDialog(false)}
            message="Are you sure you want to delete this task?"
          />
        )}
      </main>
    </div>
  );
};

export default TaskManager;