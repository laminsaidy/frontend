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
      touched: {}
    };
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
      }
    });
  };

  getFieldError = (fieldName) => {
    const { errors } = this.props;
    if (!errors || !this.state.touched[fieldName]) return null;
    
    const fieldErrors = errors[fieldName] || errors[`${fieldName}_detail`];
    if (!fieldErrors) return null;
    
    return Array.isArray(fieldErrors) ? fieldErrors.join(", ") : fieldErrors;
  };

  render() {
    const { toggle, onSave } = this.props;
    const { currentItem } = this.state;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Task Item</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="title">Title *</Label>
              <Input
                type="text"
                name="title"
                value={currentItem.title}
                onChange={this.handleInputChange}
                placeholder="Enter Task Title"
                invalid={!!this.getFieldError("title")}
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
          <Button color="success" onClick={() => onSave(this.state.currentItem)}>
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