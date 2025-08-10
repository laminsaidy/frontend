import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AuthContext from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/components/Taskdetail.css";

const TaskDetail = () => {
  const { api } = useContext(AuthContext);
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/api/tasks/${id}/`);
        setTask({
          ...res.data,
          overdue:
            res.data.due_date &&
            new Date(res.data.due_date) < new Date() &&
            res.data.status !== "Done",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching task details:", err);
        setError("Failed to load task details");
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, api]);

  const handleBack = () => {
    navigate("/tasks");
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <div className="error-message">{error}</div>;
  if (!task) return <div className="not-found-message">Task not found</div>;

  return (
    <div className="task-detail-container">
      <Helmet>
        <title>{task.title} | TaskManager</title>
        <meta name="description" content={`Details for task: ${task.title}`} />
      </Helmet>

      <button onClick={handleBack} className="back-button">
        ← Back to Tasks
      </button>

      <div className="task-detail-card">
        <div className="task-detail-header">
          <h2 className="task-detail-title">{task.title}</h2>
          {task.overdue && (
            <span className="task-detail-overdue-badge">Overdue</span>
          )}
        </div>

        <div className="task-detail-content">
          <div className="task-detail-section">
            <h3>Description</h3>
            <p className="task-detail-description">
              {task.description || "No description provided"}
            </p>
          </div>

          <div className="task-detail-meta">
            <div className="meta-item">
              <span className="meta-label">Status:</span>
              <span
                className={`meta-value status-${task.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {task.status}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Priority:</span>
              <span
                className={`meta-value priority-${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">
                {task.category === "Other" && task.custom_category
                  ? task.custom_category
                  : task.category || "No category"}
              </span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Due Date:</span>
              <span className={`meta-value ${task.overdue ? "overdue" : ""}`}>
                {task.due_date || "No due date"}
              </span>
            </div>
          </div>

          <div className="task-detail-dates">
            <div className="date-item">
              <span className="date-label">Created:</span>
              <span className="date-value">
                {new Date(task.created_at).toLocaleString()}
              </span>
            </div>
            <div className="date-item">
              <span className="date-label">Last Updated:</span>
              <span className="date-value">
                {new Date(task.updated_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
