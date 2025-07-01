# Synapses - Cloud Infrastructure Management Platform

## Overview
Synapses is a modern React-based web application for managing cloud infrastructure resources across multiple platforms. It provides a unified interface for creating and managing projects, deploying virtual machines, configuring networks, and managing various cloud resources.

## Features

### Authentication & Authorization
- Secure login system with email/password authentication
- Protected routes with role-based access control
- Persistent session management using local storage
- Automatic redirection to login for unauthenticated users

### Project Management
- Create and manage cloud infrastructure projects
- Support for multiple cloud platforms:
  - AWS
  - Azure
  - Private Cloud
  - VMware
- Project filtering and search capabilities
- Project status tracking (Active, Inactive, Pending)

### Resource Management
#### Networks
- Create and configure networks
- Subnet management
- Network status monitoring
- Security group configuration

#### Virtual Machines
- Deploy VMs across different cloud platforms
- Customizable VM configurations:
  - Instance type selection
  - Operating system selection
  - CPU and RAM configuration
  - Storage configuration
- Public IP assignment
- Network interface configuration
- VM status monitoring

#### Storage
- Data disk management
- Backup resource management
- Storage resource configuration
- Support for various storage types

#### Security
- Security resource management
- Security group configuration
- Network security settings

### User Interface
- Modern, responsive design using Tailwind CSS
- Clean and intuitive navigation
- Interactive modals for resource creation
- Real-time notifications using React Toastify
- Loading states and error handling
- Mobile-friendly layout

## Technical Architecture

### Core Technologies
- React 18+ with TypeScript
- React Router v6 for navigation
- Tailwind CSS for styling
- Zustand for state management
- React Toastify for notifications
- Heroicons for UI icons

### Project Structure
```
src/
├── components/
│   ├── common/
│   │   ├── ErrorBoundary.tsx
│   │   ├── FloatingContactButton.tsx
│   │   └── Loader.tsx
│   ├── layout/
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── modals/
│   │   ├── AddDiskModal.tsx
│   │   ├── AddNetworkModal.tsx
│   │   ├── AddVMModal.tsx
│   │   ├── ConfirmationModal.tsx
│   │   ├── CreateProjectModal.tsx
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── LogoutConfirmModal.tsx
│   │   ├── Modal.tsx
│   │   └── UserFormModal.tsx
│   └── ProtectedRoute.tsx
├── context/
│   └── AuthContext.tsx
├── pages/
│   ├── Admin.tsx
│   ├── Dashboard.tsx
│   ├── Error.tsx
│   ├── Login.tsx
│   ├── Projects.tsx
│   └── ProjectDetails.tsx
├── store/
│   └── projectStore.ts
├── services/
│   └── api.ts
└── styles/
    └── index.css
```

### Key Components

#### Layout Components
- `Layout.tsx`: Main layout wrapper with sidebar and navbar
- `Sidebar.tsx`: Navigation sidebar with dynamic menu items
- `Navbar.tsx`: Top navigation bar with user controls

#### Modal Components
- `Modal.tsx`: Base modal component with customizable sizing
- `CreateProjectModal.tsx`: Project creation interface
- `AddVMModal.tsx`: VM deployment interface
- `AddNetworkModal.tsx`: Network configuration interface
- `AddDiskModal.tsx`: Storage management interface

#### Common Components
- `Loader.tsx`: Customizable loading spinner
- `ErrorBoundary.tsx`: Error handling wrapper
- `ProtectedRoute.tsx`: Route protection HOC

#### State Management
- `AuthContext.tsx`: Authentication state and methods
- `projectStore.ts`: Project and resource management using Zustand

### Pages
- `Login.tsx`: Authentication page
- `Dashboard.tsx`: Main dashboard with overview
- `Projects.tsx`: Project listing and management
- `ProjectDetails.tsx`: Detailed project view
- `Admin.tsx`: Administrative controls
- `Error.tsx`: Error page

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Git

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/synapses.git
cd synapses
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to `http://localhost:3000`

### Development Setup
1. Install recommended VS Code extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

2. Enable format on save in VS Code settings

### Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=your_api_url
REACT_APP_ENV=development
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.
