import React, { Component } from "react";
import axios from "axios";
import TaskModal from "../context/TaskModal";

class TaskManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewStatus: "Open", 
      activeItem: {
        title: "",
        description: "",
        status: "Open",
        priority: "Medium",
        category: "General",
        due_date: "",
      },
      taskList: [],
      modal: false,
      loading: true,
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("http://localhost:8000/api/tasks/")
      .then((res) => {
        const tasksWithOverdue = res.data.map((task) => ({
          ...task,
          overdue:
            task.due_date &&
            new Date(task.due_date) < new Date() &&
            task.status !== "Done",
        }));
        this.setState({ taskList: tasksWithOverdue, loading: false });
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        this.setState({ taskList: [], loading: false });
      });
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    // Ensure category is a string, not an array
    const payload = {
      ...item,
      category: Array.isArray(item.category) ? item.category[0] : item.category,
    };

    if (item.id) {
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, payload)
        .then(this.refreshList)
        .catch((error) => {
          console.error(
            "Error occurred while updating the task:",
            error.response ? error.response.data : error.message
          );
        });
      return;
    }
    axios
      .post("http://localhost:8000/api/tasks/", payload)
      .then(this.refreshList)
      .catch((error) => {
        console.error(
          "Error occurred while creating the task:",
          error.response ? error.response.data : error.message
        );
      });
  };

  handleDelete = (item) => {
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then(this.refreshList)
      .catch((error) => {
        console.error(
          "Error occurred while deleting the task:",
          error.response ? error.response.data : error.message
        );
      });
  };

  createItem = () => {
    const item = {
      title: "",
      description: "",
      status: "Open",
      priority: "Medium",
      category: "General",
      due_date: "",
    };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  renderItems = () => {
    const { viewStatus } = this.state;
    const filteredItems = this.state.taskList.filter(
      (item) => item.status === viewStatus
    );

    return filteredItems.map((item) => {
      // Define status colors
      const statusColors = {
        Open: "red",
        "In Progress": "orange",
        Done: "green",
      };

      // Define priority colors
      const priorityColors = {
        High: "#ff4444", 
        Medium: "#ffbb33", 
        Low: "#00C851", 
      };

      // Get the colors based on the task's status and priority
      const statusColor = statusColors[item.status] || "#000000"; 
      const priorityColor = priorityColors[item.priority] || "#000000"; 

      return (
        <li
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span
            className={`todo-title mr-2 ${item.overdue ? "text-danger" : ""}`}
            title={item.description}
            style={{ cursor: "pointer" }} 
            onClick={() => this.props.history.push(`/task/${item.id}`)}
          >
            {item.title} -{" "}
            <span style={{ color: priorityColor, fontWeight: "bold" }}>
              {item.priority}
            </span>{" "}
            -{" "}
            <span style={{ color: statusColor, fontWeight: "bold" }}>
              {item.status}
            </span>{" "}
            - {item.category} {item.overdue ? "(Overdue)" : ""}
          </span>

          <span>
            <button
              onClick={() => this.editItem(item)}
              className="btn btn-secondary mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => this.handleDelete(item)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </span>
        </li>
      );
    });
  };

  renderTabList = () => {
    const statuses = ["Open", "In Progress", "Done"];
    const colors = { Open: "red", "In Progress": "orange", Done: "green" };

    return (
      <div className="my-5 tab-list">
        {statuses.map((status) => (
          <span
            key={status}
            onClick={() => this.setState({ viewStatus: status })}
            style={{
              padding: "5px 8px",
              border: "1px solid rgb(5, 5, 128)",
              borderRadius: "10px",
              marginRight: "5px",
              cursor: "pointer",
              backgroundColor:
                this.state.viewStatus === status ? colors[status] : "white",
              color: this.state.viewStatus === status ? "white" : "black",
            }}
          >
            {status}
          </span>
        ))}
      </div>
    );
  };

  render() {
    const { loading } = this.state;

    if (loading) {
      return <div>Loading tasks...</div>;
    }

    return (
      <main className="content" style={{ paddingTop: "140px" }}>
        <h1 className="text-black text-uppercase text-center my-4">
          Task Manager
        </h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <button onClick={this.createItem} className="btn btn-primary">
                Add task
              </button>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal && (
          <TaskModal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        )}
      </main>
    );
  }
}

export default TaskManager;