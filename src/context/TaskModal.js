import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormFeedback } from "reactstrap";

class TaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: {
        title: props.activeItem.title || "",
        description: props.activeItem.description || "",
        status: props.activeItem.status || "Open",
        priority: props.activeItem.priority || "Medium",
        category: props.activeItem.category || "General",
        due_date: props.activeItem.due_date || "",
        ...(props.activeItem.id && { id: props.activeItem.id })
      },
      touched: {},
      formErrors: {}
    };
  }

  componentDidUpdate(prevProps) {
    // Update errors when props change
    if (prevProps.errors !== this.props.errors) {
      this.setState({ formErrors: this.props.errors || {} });
    }
  }

  // NEW: Enhanced error handling method
  getFieldError = (fieldName) => {
    const { formErrors } = this.state;
    
    // Check for errors in different formats:
    // 1. Exact field name match (e.g., "title")
    // 2. Lowercase field name (e.g., "description" vs "Description")
    // 3. Django-style field suffixes (e.g., "title_detail")
    const error = formErrors[fieldName] || 
                 formErrors[fieldName.toLowerCase()] || 
                 formErrors[`${fieldName}_detail`];

    // Format array errors into a string
    return error ? (Array.isArray(error) ? error.join(", ") : error) : null;
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      currentItem: {
        ...this.state.currentItem,
        [name]: value
      },
      touched: {
        ...this.state.touched,
        [name]: true
      },
      formErrors: {
        ...this.state.formErrors,
        [name]: null // Clear error when user types
      }
    });
  };

  handleSubmit = () => {
    const { currentItem } = this.state;
    const { onSave } = this.props;

    // Validate required fields
    const errors = {};
    if (!currentItem.title.trim()) {
      errors.title = "Title is required";
    }

    if (Object.keys(errors).length > 0) {
      this.setState({
        formErrors: errors,
        touched: {
          title: true,
          ...this.state.touched
        }
      });
      return;
    }

    onSave(currentItem);
  };

  render() {
    const { toggle } = this.props;
    const { currentItem } = this.state;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {currentItem.id ? "Edit Task" : "Add New Task"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => { e.preventDefault(); this.handleSubmit(); }}>
            <FormGroup>
              <Label for="title">Title *</Label>
              <Input
                type="text"
                name="title"
                value={currentItem.title}
                onChange={this.handleInputChange}
                placeholder="Enter Task Title"
                invalid={!!this.getFieldError("title")}
                required
              />
              <FormFeedback>{this.getFieldError("title")}</FormFeedback>
            </FormGroup>

            {/* Other form fields with consistent error handling */}
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                value={currentItem.description}
                onChange={this.handleInputChange}
                placeholder="Enter Task Description"
                invalid={!!this.getFieldError("description")}
              />
              <FormFeedback>{this.getFieldError("description")}</FormFeedback>
            </FormGroup>

            {/* Example for status field */}
            <FormGroup>
              <Label for="status">Status</Label>
              <Input
                type="select"
                name="status"
                value={currentItem.status}
                onChange={this.handleInputChange}
                invalid={!!this.getFieldError("status")}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </Input>
              <FormFeedback>{this.getFieldError("status")}</FormFeedback>
            </FormGroup>

            {/* Add similar error handling for all other fields */}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleSubmit}>
            Save
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default TaskModal;