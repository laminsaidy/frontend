import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AuthContext from "../context/AuthContext";
import "../styles/components/Task.css";
import Swal from "sweetalert2";

const AddTask = () => {
  const { api } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Open");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("");
  const [due_date, setDueDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      title,
      description,
      status,
      priority,
      category,
      due_date,
    };
    try {
      const response = await api.post("/api/tasks/", taskData);
      if (response.status === 201) {
        Swal.fire({
          title: "Task added successfully",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-end",
          showConfirmButton: false,
        });
        navigate("/tasks");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      let errorMessage = "Failed to add task, please try again.";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      Swal.fire({
        title: errorMessage,
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-end",
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="add-task-container">
      <Helmet>
        <title>Add Task</title>
        <meta name="description" content="Add a new task to your task manager." />
      </Helmet>
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </div>
  );
};

export default AddTask;
