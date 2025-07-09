// src/pages/TaskDetail.js
import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import '../styles/components/Taskdetail.css';

const TaskDetail = () => {
  const { api } = useContext(AuthContext);
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    api.get(`/api/tasks/${id}/`)
      .then((res) => {
        setTask(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching task details:", err);
        setLoading(false);
      });
  }, [id, api]);

  const handleBack = () => {
    history.push("/tasks");
  };

  if (loading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div className="task-detail-container">
      <h2 className="task-detail-header">{task.title}</h2>
      <p className="task-detail-description"><strong>Description:</strong> {task.description}</p>
      <p className="task-detail-status"><strong>Status:</strong> {task.status}</p>
      <p className="task-detail-priority"><strong>Priority:</strong> {task.priority}</p>
      <p className="task-detail-category"><strong>Category:</strong> {task.category}</p>
      <p className="task-detail-due-date"><strong>Due Date:</strong> {task.due_date || "No due date"}</p>
      {task.overdue && (
        <p className="task-detail-overdue">
          <strong>Overdue!</strong>
        </p>
      )}

      <button className="back-button" onClick={handleBack}>
        BACK
      </button>
    </div>
  );
};

export default TaskDetail;
