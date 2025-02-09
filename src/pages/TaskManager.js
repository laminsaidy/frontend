import React, { Component } from "react";
import axios from "axios";  

class TaskManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
          viewCompleted: false,
          activeItem: { title: "", description: "", completed: false },
          taskList: [],
          modal: false,
        };
    }
      
    componentDidMount() {
        this.refreshList();
    }
      
    refreshList = () => {
        axios
          .get("http://localhost:8000/api/tasks/")
          .then(res => this.setState({ taskList: res.data }))
          .catch(err => console.log(err));
    };

}
export default TaskManager; 
