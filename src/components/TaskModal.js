import React, { Component } from "react";
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input
} from "reactstrap";

class TaskModal extends Component {
  static defaultProps = {
    activeItem: {
      title: "",
      description: "",
      status: "Open",
      priority: "Low",
      category: "General",
      due_date: ""
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      currentItem: {
        ...this.props.activeItem,
        category: this.props.activeItem.category || "General"
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
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}> Task Item </ModalHeader>
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
                type="text"
                name="description"
                value={currentItem.description}
                onChange={this.handleInputChange}
                placeholder="Enter Task Description"
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
                type="text"
                name="category"
                value={currentItem.category}
                onChange={this.handleInputChange}
                placeholder="Enter Category (e.g., House Chores)"
              />
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
          <Button color="success" onClick={() => onSave(currentItem)}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default TaskModal;
