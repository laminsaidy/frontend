import React, { Component } from "react";
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input
} from "reactstrap";
import "../styles/components/TaskModal.css";

class TaskModal extends Component {
  static defaultProps = {
    activeItem: {
      title: "",
      description: "",
      status: "Open",
      priority: "Low",
      category: "Work",  // Default to Work instead of General
      custom_category: "",
      due_date: ""
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      currentItem: {
        ...this.props.activeItem,
        category: this.props.activeItem.category || "Work",
        custom_category: this.props.activeItem.custom_category || ""
      }
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      currentItem: { ...prevState.currentItem, [name]: value }
    }));
  };

  render() {
    const { toggle, onSave } = this.props;
    const { currentItem } = this.state;

    return (
      <Modal isOpen={true} toggle={toggle} className="custom-task-modal">
        <ModalHeader toggle={toggle}>📝 Task Details</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                value={currentItem.title}
                onChange={this.handleInputChange}
                placeholder="Enter Task Title"
              />
            </FormGroup>

            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                value={currentItem.description}
                onChange={this.handleInputChange}
                placeholder="Describe the task"
              />
            </FormGroup>

            <FormGroup>
              <Label for="status">Status</Label>
              <Input
                type="select"
                name="status"
                value={currentItem.status}
                onChange={this.handleInputChange}
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Done</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="priority">Priority</Label>
              <Input
                type="select"
                name="priority"
                value={currentItem.priority}
                onChange={this.handleInputChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Input>
            </FormGroup>

            {/* Category Dropdown */}
            <FormGroup>
              <Label for="category">Category</Label>
              <Input
                type="select"
                name="category"
                value={currentItem.category}
                onChange={this.handleInputChange}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Urgent">Urgent</option>
                <option value="Other">Other</option>
              </Input>

              {/* Show custom category input if "Other" is selected */}
              {currentItem.category === "Other" && (
                <Input
                  type="text"
                  name="custom_category"
                  value={currentItem.custom_category}
                  onChange={this.handleInputChange}
                  placeholder="Enter custom category"
                  className="mt-2"
                />
              )}
            </FormGroup>

            <FormGroup>
              <Label for="due_date">Due Date</Label>
              <Input
                type="date"
                name="due_date"
                value={currentItem.due_date}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(currentItem)}
          >
            Save
          </Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default TaskModal;
