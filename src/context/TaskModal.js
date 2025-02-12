import React, { Component } from "react";

// Importing necessary components from reactstrap
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
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
    const { toggle, onSave } = this.props; // Destructuring onSave from props
    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}> Task Item </ModalHeader>
        <ModalBody>
          <Form>
            {/* 1. Title input */}
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                value={this.state.currentItem.title} // Updated reference
                onChange={this.handleInputChange} // Updated handler
                placeholder="Enter Task Title"
              />
            </FormGroup>

            {/* 2. Description input */}
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                value={this.state.currentItem.description} // Updated reference
                onChange={this.handleInputChange} // Updated handler
                placeholder="Enter Task Description"
              />
            </FormGroup>

            {/* 3. Completed checkbox */}
            <FormGroup check>
              <Label for="completed">
                <Input
                  type="checkbox"
                  name="completed"
                  checked={this.state.currentItem.completed} // Updated reference
                  onChange={this.handleInputChange} // Updated handler
                />
                Completed
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => onSave(this.state.currentItem)}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default TaskModal;
