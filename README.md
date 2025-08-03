# Task Manager Calendar App

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
    - [Core Features](#core-features)
    - [User Feedback & UX](#user-feedback--ux)
    - [Admin & Security](#admin--security)
    - [Screenshots](#screenshots)
3. [Agile Planning](#agile-planning)
    - [MoSCoW Prioritisation](#moscow-prioritisation)
    - [User Stories & Epics](#user-stories--epics)
    - [Sprints](#sprints)
4. [Entity Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
5. [Technologies Used](#technologies-used)
6. [Installation & Deployment](#installation--deployment)
7. [Testing](#testing)
    - [Manual Testing](#manual-testing)
    - [Automated Testing](#automated-testing)
8. [Known Bugs](#known-bugs)
9. [Credits & Acknowledgements](#credits--acknowledgements)


## Project Overview

The Task Manager Calendar App is a full-stack productivity tool that allows users to create, organize, and track tasks with due dates, priorities, and categories. It is designed to help users stay organized and focused, offering a clean user interface and dynamic task status tracking (Open → In Progress → Done).

Each user has their own private task list and can:

- Register or log in to their account
- Create new tasks with custom attributes (e.g., due date, priority)
- Edit or delete tasks
- Automatically mark tasks as "overdue" if the due date has passed
- Move tasks between status stages (Open, In Progress, Done)

The application uses Django REST Framework on the backend and React on the frontend. It is fully responsive and accessible on both desktop and mobile devices.

This project was built as the Portfolio Project 5: Full-Stack Toolkit for the Code Institute diploma, demonstrating skills in Agile methodology, API development, user authentication, data handling, and deployment to a live platform.


## Features

### Core Features

- **User Authentication**
  - Register and log in securely
  - Token-based authentication with protected routes
  - Users can only see and manage their own tasks

- **Task Management**
  - Create new tasks with a title, description, due date, priority, and category
  - Edit or delete existing tasks
  - Real-time task status switching (Open → In Progress → Done)
  - Tasks are automatically marked as “Overdue” if the due date has passed and the task is not done

- **Task Display**
  - Filtered by status: Open, In Progress, Done
  - Clearly styled task cards with badges for priority, status, and overdue
  - Confirmation modal before deleting a task

### User Feedback & UX

- **Form Validation**
  - Prevent empty task titles and past due dates
  - Friendly toast messages for form errors and success

- **Visual Design**
  - Fully responsive on all screen sizes
  - Modern layout using card components and badges
  - Color-coded status and priority indicators for easy scanning

- **Navigation**
  - Clean navbar with route-based navigation
  - Back buttons and confirmation modals improve usability

### Admin & Security

- **Backend Security**
  - DRF permission classes restrict access to authenticated users only
  - Environment variables securely manage sensitive credentials

- **Deployment**
  - Fully deployed on Render (backend and frontend)
  - Uses PostgreSQL in production and SQLite locally

## Screenshots

### 1. Login Page
![Login Page](docs/screens/login.png)

### 2. Register Page
![Register Page](docs/screens/register.png)

### 3. Task Dashboard – Open Tasks
![Open Tasks](docs/screens/dashboard-open.png)

### 4. Task Dashboard – In Progress Tasks
![In Progress Tasks](docs/screens/dashboard-progress.png)

### 5. Task Dashboard – Done Tasks
![Done Tasks](docs/screens/dashboard-done.png)

### 6. Add New Task Modal
![Add Task Modal](docs/screens/add-task.png)

### 7. Edit Task Modal
![Edit Task Modal](docs/screens/edit-task.png)

### 8. Toast Notification (Success or Error)
![Toast Notification](docs/screens/toast.png)

### 9. Mobile View (Responsive Layout)
![Mobile View](docs/screens/mobile.png)



## Agile Planning

This project was planned and managed using GitHub Issues, a Project Board, and MoSCoW prioritisation.

### MoSCoW Prioritisation

All tasks were assigned one of the following priority labels:
### MoSCoW Prioritisation

- 🟥 **Must-Have**
  - User registration and login
  - Token-based authentication
  - Task creation and display
  - Task editing and deletion
  - Status-based task filtering
  - User-specific task access

- 🟨 **Should-Have**
  - Task priorities and categories
  - Overdue task detection
  - Task status buttons (Open → In Progress → Done)
  - Delete confirmation modal
  - Edit modal pre-filling

- 🟩 **Could-Have**
  - Toast notifications
  - Basic form validation (title, due date)
  - Responsive design for all screen sizes
  - SEO tags using `react-helmet-async`
  - Visual styling (colors, badges)

- ⚪️ **Won’t-Have**
  - Calendar UI
  - Multi-user task assignment
  - Task comments/attachments
  - Push/email notifications
  - Admin reporting tools


You can view the live MoSCoW-labeled issue board here:  
🔗 [GitHub Issues with MoSCoW Labels](https://github.com/laminsaidy/frontend/issues)

### User Stories & Epics

User stories were grouped into high-level Epics to guide feature development:

- 🧩 **Epic: User Authentication**
  - Register and login forms
  - Token handling and private route protection

- 🧩 **Epic: Task Management**
  - Create, update, delete tasks
  - Set due dates, priorities, categories
  - Status logic: Open → In Progress → Done
  - Overdue detection

- 🧩 **Epic: UI & UX**
  - Responsive layout
  - Toast notifications
  - Tabbed filtering and color indicators

- 🧩 **Epic: Agile & Deployment**
  - Environment variable setup
  - README and testing documentation
  - Live deployment on Render

Each story included acceptance criteria and was linked to the appropriate Epic.

### Sprints

Development was split into two main sprints:

- **Sprint 1**
  - Set up backend with Django & DRF
  - Create models and authentication system
  - Build basic React structure and login flow

- **Sprint 2**
  - Implement task features (CRUD, filtering, overdue logic)
  - Style the app with status-based views
  - Add validation, toasts, and final deployment


