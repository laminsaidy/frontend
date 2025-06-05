import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from 'reactstrap';
import {
  statusDisplayMap,
  statusCodeMap,
  priorityMap,
} from '../utils/taskMappings';

class TaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: {
        title: props.activeItem.title || '',
        description: props.activeItem.description || '',
        status: props.activeItem.status || 'O',
        priority: props.activeItem.priority || 'M',
        category: props.activeItem.category || 'General',
        due_date: props.activeItem.due_date || '',
        ...(props.activeItem.id && { id: props.activeItem.id }),
      },
      touched: {},
      formErrors: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ formErrors: this.props.errors || {} });
    }
  }

  getFieldError = (fieldName) => {
    const { formErrors } = this.state;
    const error =
      formErrors[fieldName] ||
      formErrors[fieldName.toLowerCase()] ||
      formErrors[`${fieldName}_detail`];
    return error ? (Array.isArray(error) ? error.join(', ') : error) : null;
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      currentItem: {
        ...prevState.currentItem,
        [name]: value,
      },
      touched: {
        ...prevState.touched,
        [name]: true,
      },
      formErrors: {
        ...prevState.formErrors,
        [name]: null,
      },
    }));
  };

  handleSubmit = () => {
    const { currentItem } = this.state;
    const errors = {};

    if (!currentItem.title.trim()) {
      errors.title = 'Title is required';
    }

    if (Object.keys(errors).length > 0) {
      this.setState({
        formErrors: errors,
        touched: { ...this.state.touched, title: true },
      });
      return;
    }

    // Format data for backend
    const formattedItem = {
      ...currentItem,
      status: statusCodeMap[currentItem.status] || currentItem.status,
      priority: priorityMap[currentItem.priority] || currentItem.priority,
    };

    this.props.onSave(formattedItem);
  };

  render() {
    const { toggle } = this.props;
    const { currentItem } = this.state;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {currentItem.id ? 'Edit Task' : 'Add New Task'}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              this.handleSubmit();
            }}
          >
            <FormGroup>
              <Label for="title">Title *</Label>
              <Input
                type="text"
                name="title"
                value={currentItem.title}
                onChange={this.handleInputChange}
                invalid={!!this.getFieldError('title')}
                required
              />
              <FormFeedback>{this.getFieldError('title')}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                value={currentItem.description}
                onChange={this.handleInputChange}
                invalid={!!this.getFieldError('description')}
              />
              <FormFeedback>{this.getFieldError('description')}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="status">Status</Label>
              <Input
                type="select"
                name="status"
                value={currentItem.status}
                onChange={this.handleInputChange}
                invalid={!!this.getFieldError('status')}
              >
                {Object.entries(statusDisplayMap).map(([code, display]) => (
                  <option key={code} value={code}>
                    {display}
                  </option>
                ))}
              </Input>
              <FormFeedback>{this.getFieldError('status')}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="priority">Priority</Label>
              <Input
                type="select"
                name="priority"
                value={currentItem.priority}
                onChange={this.handleInputChange}
                invalid={!!this.getFieldError('priority')}
              >
                <option value="L">Low</option>
                <option value="M">Medium</option>
                <option value="H">High</option>
              </Input>
              <FormFeedback>{this.getFieldError('priority')}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="category">Category</Label>
              <Input
                type="text"
                name="category"
                value={currentItem.category}
                onChange={this.handleInputChange}
                invalid={!!this.getFieldError('category')}
              />
              <FormFeedback>{this.getFieldError('category')}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="due_date">Due Date</Label>
              <Input
                type="date"
                name="due_date"
                value={currentItem.due_date}
                onChange={this.handleInputChange}
                invalid={!!this.getFieldError('due_date')}
              />
              <FormFeedback>{this.getFieldError('due_date')}</FormFeedback>
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
