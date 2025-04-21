import React, { Component } from "react";
import axios from "axios";
import TaskModal from "../context/TaskModal";
import ConfirmationDialog from "../context/ConfirmationDialog"; 
import '../styles/components/TaskCard.css';

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
      showConfirmationDialog: false,
      itemToDelete: null,
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
    this.setState({ showConfirmationDialog: true, itemToDelete: item });
  };

  confirmDelete = () => {
    const { itemToDelete } = this.state;
    axios
      .delete(`http://localhost:8000/api/tasks/${itemToDelete.id}/`)
      .then(this.refreshList)
      .catch((error) => {
        console.error(
          "Error occurred while deleting the task:",
          error.response ? error.response.data : error.message
        );
      });
    this.setState({ showConfirmationDialog: false, itemToDelete: null });
  };

  cancelDelete = () => {
    this.setState({ showConfirmationDialog: false, itemToDelete: null });
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

    return filteredItems.map((item) => (
      <div
        key={item.id}
        className={`task-card ${item.priority.toLowerCase()} ${item.overdue ? 'overdue' : ''}`}
        onClick={() => this.props.history.push(`/task/${item.id}`)}
      >
        <div className="task-card-header">
          <h3 className="task-title">
            {item.title}
            {item.overdue && <span className="overdue-badge">OVERDUE</span>}
          </h3>
          <div className="task-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                this.editItem(item);
              }}
              className="btn-edit"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                this.handleDelete(item);
              }}
              className="btn-delete"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="task-meta">
          <span className={`priority-badge ${item.priority.toLowerCase()}`}>
            {item.priority}
          </span>
          <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
            {item.status}
          </span>
          <span className="task-category">
            {item.category}
          </span>
          {item.due_date && (
            <span className="task-due">
              📅 {new Date(item.due_date).toLocaleDateString()}
            </span>
          )}
        </div>

        {item.description && (
          <p className="task-description">
            {item.description}
          </p>
        )}
      </div>
    ));
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
    const { loading, showConfirmationDialog } = this.state;

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
              <div className="task-list-container">
                {this.renderItems()}
              </div>
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
        <ConfirmationDialog
          show={showConfirmationDialog}
          onConfirm={this.confirmDelete}
          onCancel={this.cancelDelete}
          message="Are you sure you want to delete this task?"
        />
      </main>
    );
  }
}

export default TaskManager;
