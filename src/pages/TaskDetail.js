import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";
import '../styles/components/Taskdetail.css';

const TaskDetail = () => {
  const { api } = useContext(AuthContext);
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/api/tasks/${id}/`);
        setTask(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching task details:", err);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch task details. Please try again later.",
          icon: "error",
          toast: true,
          timer: 3000,
          position: "top-end",
          showConfirmButton: false,
        });
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, api]);

  const handleBack = () => {
    navigate("/tasks");
  };

  if (loading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div className="task-detail-container">
      <h2 className="task-detail-header">{task.title}</h2>
      <p className="task-detail-description"><strong>Description:</strong> {task.description || "No description"}</p>
      <p className="task-detail-status"><strong>Status:</strong> {task.status}</p>
      <p className="task-detail-priority"><strong>Priority:</strong> {task.priority}</p>
      <p className="task-detail-category"><strong>Category:</strong> {task.category || "No category"}</p>
      <p className="task-detail-due-date"><strong>Due Date:</strong> {task.due_date || "No due date"}</p>
      {task.overdue && (
        <p className="task-detail-overdue">
          <strong>Overdue!</strong>
        </p>
      )}
      <p className="task-detail-created-at"><strong>Created At:</strong> {new Date(task.created_at).toLocaleString()}</p>
      <p className="task-detail-updated-at"><strong>Updated At:</strong> {new Date(task.updated_at).toLocaleString()}</p>

      <button className="back-button" onClick={handleBack}>
        BACK
      </button>
    </div>
  );
};

export default TaskDetail;
