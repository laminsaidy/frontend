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

  render() {
    const { toggle } = this.props; // Destructure toggle function from props
    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Task Details</ModalHeader>
        <ModalBody>
          <Form>
            {/* Form fields will be added here */}
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