import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from 'react-toastify';
import AuthContext from "../context/AuthContext";
import "../styles/components/Task.css";

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

    if (!title.trim()) {
      toast.warning("Title is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (due_date && new Date(due_date) < new Date()) {
      toast.warning("Due date cannot be in the past.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

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
        toast.success("Task added successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/tasks");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      let errorMessage = "Failed to add task, please try again.";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
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
        {/* Form fields go here */}
      </form>
    </div>
  );
};

export default AddTask;
