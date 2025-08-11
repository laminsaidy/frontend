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
      priority: "Medium",
      category: "Work",
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
      currentItem: { 
        ...prevState.currentItem, 
        [name]: value 
      }
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
              <Label for="title">Title <span className="text-danger">*</span></Label>
              <Input
                type="text"
                name="title"
                value={currentItem.title}
                onChange={this.handleInputChange}
                placeholder="Enter Task Title"
                required
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
                rows={4}
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
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
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
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Input>
            </FormGroup>

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
              
              {currentItem.category === "Other" && (
                <FormGroup className="mt-2">
                  <Label for="custom_category">Custom Category <span className="text-danger">*</span></Label>
                  <Input
                    type="text"
                    name="custom_category"
                    value={currentItem.custom_category}
                    onChange={this.handleInputChange}
                    placeholder="Enter your custom category name"
                    required={currentItem.category === "Other"}
                  />
                </FormGroup>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="due_date">Due Date</Label>
              <Input
                type="date"
                name="due_date"
                value={currentItem.due_date}
                onChange={this.handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="primary" 
            onClick={() => onSave(currentItem)}
            disabled={!currentItem.title || (currentItem.category === "Other" && !currentItem.custom_category)}
          >
            Save Task
          </Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default TaskModal;