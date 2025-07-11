import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={due_date}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-submit">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
