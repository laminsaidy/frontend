import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>{task.title}</title>
        <meta name="description" content={`Details for task: ${task.title}`} />
      </Helmet>
      <h2 className="task-detail-header">{task.title}</h2>
      {/* Task details */}
    </div>
  );
};

export default TaskDetail;
