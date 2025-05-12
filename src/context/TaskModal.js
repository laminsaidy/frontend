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

  getFieldError = (fieldName) => {
    const { formErrors, touched } = this.state;
    if (!touched[fieldName]) return null;

    const error = formErrors[fieldName] ||
                 formErrors[`${fieldName}_detail`];

    return error ? (Array.isArray(error) ? error.join(", ") : error) : null;
  };

  handleSubmit = () => {
    const { currentItem } = this.state;
    const { onSave } = this.props;

    // Validate required fields before submission
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

            <FormGroup>
              <Label for="priority">Priority</Label>
              <Input
                type="select"
                name="priority"
                value={currentItem.priority}
                onChange={this.handleInputChange}
                invalid={!!this.getFieldError("priority")}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Input>
              <FormFeedback>{this.getFieldError("priority")}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="category">Category</Label>
              <Input
                type="text"
                name="category"
                value={currentItem.category}
                onChange={this.handleInputChange}
                placeholder="Enter Category"
                invalid={!!this.getFieldError("category")}
              />
              <FormFeedback>{this.getFieldError("category")}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="due_date">Due Date</Label>
              <Input
                type="date"
                name="due_date"
                value={currentItem.due_date}
                onChange={this.handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                invalid={!!this.getFieldError("due_date")}
              />
              <FormFeedback>{this.getFieldError("due_date")}</FormFeedback>
            </FormGroup>
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
