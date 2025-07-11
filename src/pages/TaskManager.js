import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TaskModal from "../components/TaskModal";
import ConfirmationDialog from "../context/ConfirmationDialog";
import '../styles/components/TaskManager.css';
import AuthContext from "../context/AuthContext";

const TaskManager = () => {
  const { api, user, logoutUser } = useContext(AuthContext);
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

  const refreshList = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/tasks/");
      const tasksWithOverdue = response.data.map((task) => ({
        ...task,
        overdue: task.due_date && new Date(task.due_date) < new Date() && task.status !== "Done",
      }));
      setTaskList(tasksWithOverdue);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      if (error.response?.status === 401) {
        logoutUser();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    refreshList();
  }, [user, navigate]);

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

  const updateTaskStatus = async (item, newStatus) => {
    try {
      await api.put(`/api/tasks/${item.id}/`, { ...item, status: newStatus });
      refreshList();
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const renderItems = () => {
    const filteredTasks = taskList.filter((task) => task.status === viewStatus);
    
    if (filteredTasks.length === 0) {
      return (
        <div className="empty-state">
          <p>No {viewStatus.toLowerCase()} tasks found</p>
          {viewStatus === "Open" && (
            <button 
              onClick={createItem} 
              className="btn btn-primary"
            >
              Create First Task
            </button>
          )}
        </div>
      );
    }

    return filteredTasks.map((task) => (
      <div
        key={task.id}
        className={`task-card ${task.priority.toLowerCase()} ${task.overdue ? 'overdue' : ''}`}
        onClick={() => navigate(`/task/${task.id}`)}
      >
        <div className="task-card-header">
          <h3>{task.title}</h3>
          <div className="task-actions">
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={(e) => {
                e.stopPropagation();
                editItem(task);
              }}
            >
              Edit
            </button>
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(task);
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <p className="task-description">{task.description}</p>
        <div className="task-meta">
          <span className={`badge ${task.status.toLowerCase().replace(' ', '-')}`}>
            {task.status}
          </span>
          <span className="task-due-date">
            {task.due_date ? `Due: ${new Date(task.due_date).toLocaleDateString()}` : 'No due date'}
          </span>
        </div>
        {task.overdue && (
          <div className="overdue-banner">OVERDUE</div>
        )}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <main className="task-manager-container">
      <div className="task-manager-header">
        <h1>Task Manager</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}</span>
          <button 
            onClick={logoutUser}
            className="btn btn-outline-danger logout-btn"
          >
            Logout
          </button>
        </div>
        <button 
          onClick={createItem}
          className="btn btn-primary add-task-btn"
        >
          + Add New Task
        </button>
      </div>

      <div className="status-tabs">
        {["Open", "In Progress", "Done"].map((status) => (
          <button
            key={status}
            className={`tab-btn ${viewStatus === status ? 'active' : ''}`}
            onClick={() => setViewStatus(status)}
          >
            {status}
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
  );
};

export default TaskManager;