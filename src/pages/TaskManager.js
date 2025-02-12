import React, { Component } from "react";
import axios from "axios";
import TaskModal from "../context/TaskModal";

class TaskManager extends Component {
  constructor(props) {
    console.log("TaskManager component rendered");
    super(props);
    this.state = {
      viewCompleted: false,
      activeItem: { title: "", description: "", completed: false },
      taskList: [],
      modal: false,
      loading: true, // Add loading state
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("http://localhost:8000/api/tasks/")
      .then((res) => this.setState({ taskList: res.data, loading: false }))
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        this.setState({ taskList: [], loading: false }); // Set loading to false on error
      });
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("http://localhost:8000/api/tasks/", item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.taskList.filter(
      (item) => item.completed === viewCompleted
    );
    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${viewCompleted ? "completed-todo" : ""}`}
          title={item.description}
        >
          {item.title}
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
    ));
  };

  renderTabList = () => {
    const tabStyle = {
      padding: "5px 8px",
      border: "1px solid rgb(5, 5, 128)",
      borderRadius: "10px",
      marginRight: "5px",
      cursor: "pointer",
    };
  
    const completedTabStyle = {
      ...tabStyle,
      backgroundColor: "green", // Green color for completed tab
      color: "#fff",
    };
  
    const incompleteTabStyle = {
      ...tabStyle,
      backgroundColor: "red", // Red color for incomplete tab
      color: "#fff",
    };
  
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          style={this.state.viewCompleted ? completedTabStyle : tabStyle}
        >
          completed
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          style={this.state.viewCompleted ? tabStyle : incompleteTabStyle}
        >
          Incompleted
        </span>
      </div>
    );
  };  

  displayCompleted = (viewCompleted) => {
    this.setState({ viewCompleted });
  };

  render() {
    const { loading } = this.state;

    if (loading) {
      return <div>Loading tasks...</div>;
    }

    return (
      <main className="content" style={{ paddingTop: "140px" }}>
        <h1 className="text-black text-uppercase text-center my-4">Task Manager</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <button onClick={this.createItem} className="btn btn-primary">
                Add task
              </button>
              {/* Render the tab buttons */}
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
