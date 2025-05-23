# Synapse - Cloud Infrastructure Management Platform

Synapse is a modern frontend React application for managing cloud infrastructure resources. It allows users to create projects, deploy virtual machines, configure networks, and manage data disks across different cloud platforms.

## Features

- **Authentication**
  - Login with email and password
  - Protected routes for authenticated users

- **Project Management**
  - Create and view cloud infrastructure projects
  - Support for multiple cloud platforms (AWS, Azure, Private Cloud, VMware)

- **Resource Management**
  - Networks and subnets configuration
  - Virtual machine deployment
  - Data disk management

- **Modern UI**
  - Responsive design with mobile support
  - Clean, minimalist interface using Tailwind CSS
  - Interactive modals and notifications

## Tech Stack

- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Zustand for state management
- React Toastify for notifications
- Heroicons for icons

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/Synapse.git
cd Synapse
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Login Credentials

Use the following demo credentials to log in:
- Email: `email@demo.com`
- Password: `123456789`

## Project Structure

```
Synapse/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── modals/
│   │   │   ├── Modal.tsx
│   │   │   ├── CreateProjectModal.tsx
│   │   │   ├── AddNetworkModal.tsx
│   │   │   ├── AddVMModal.tsx
│   │   │   └── AddDiskModal.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Admin.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Error.tsx
│   │   ├── Login.tsx
│   │   └── ProjectDetails.tsx
│   ├── store/
│   │   └── projectStore.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
└── tailwind.config.js
```

## Future Enhancements

- User management and role-based access control
- Integration with real cloud provider APIs
- Resource monitoring and metrics
- Cost estimation and budgeting
- Resource templates and automation

## License

This project is licensed under the MIT License. # Synapse
