import React, { Component } from "react";

// Importing necessary components from reactstrap
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from "reactstrap";

// Creating a class-based modal component
class TaskModal extends Component {
  constructor(props) {
    super(props);
    // Initialize state with the active item passed via props
    this.state = {
      currentItem: this.props.activeItem,
    };
  }

  // Handler for input changes, including checkboxes
handleInputChange = (event) => {
    const { name, type, checked, value } = event.target;

    // Determine the value based on the input type
    const updatedValue = type === "checkbox" ? checked : value;

    // Update the current item in the state
    const updatedItem = { ...this.state.currentItem, [name]: updatedValue };

    // Set the updated item to the state
    this.setState({ currentItem: updatedItem });
  };

  render() {
    const { toggle } = this.props; // Destructure toggle function from props
    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Task Details</ModalHeader>
        <ModalBody>
          <Form>
          <Form>
            {/* 1. Title input */}
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                value={this.state.activeItem.title}
                onChange={this.handleChange}
                placeholder="Enter Task Title"
              />
            </FormGroup>

            {/* 2. Description input */}
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                value={this.state.activeItem.description}
                onChange={this.handleChange}
                placeholder="Enter Task Description"
              />
            </FormGroup>

            {/* 3. Completed checkbox */}
            <FormGroup check>
              <Label for="completed">
                <Input
                  type="checkbox"
                  name="completed"
                  checked={this.state.activeItem.completed}
                  onChange={this.handleChange}
                />
                Completed
              </Label>
            </FormGroup>
          </Form>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default TaskModal;