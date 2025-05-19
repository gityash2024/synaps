import { create } from 'zustand';

export type Platform = 'AWS' | 'Azure' | 'Private Cloud' | 'VMware';
export type OSType = 'Ubuntu' | 'Windows Server';
export type Status = 'Active' | 'Inactive' | 'Pending';

export interface Network {
  id: string;
  name: string;
  subnets: string[];
}

export interface VirtualMachine {
  id: string;
  name: string;
  networkId: string;
  status: Status;
  type: string;
  os: OSType;
  cpu: string;
  ram: string;
  diskSize: number;
}

export interface DataDisk {
  id: string;
  name: string;
  size: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  platform: Platform;
  billingOrganization: string;
  owner: string;
  status: Status;
  networks: Network[];
  virtualMachines: VirtualMachine[];
  dataDisks: DataDisk[];
}

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  addProject: (project: Omit<Project, 'id' | 'networks' | 'virtualMachines' | 'dataDisks'>) => void;
  setSelectedProject: (projectId: string) => void;
  addNetwork: (projectId: string, network: Omit<Network, 'id'>) => void;
  addVirtualMachine: (projectId: string, vm: Omit<VirtualMachine, 'id'>) => void;
  addDataDisk: (projectId: string, disk: Omit<DataDisk, 'id'>) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [
    {
      id: '1',
      name: 'Sample Cloud Project',
      description: 'A sample cloud infrastructure project',
      platform: 'AWS',
      billingOrganization: 'Demo Organization',
      owner: 'Demo User',
      status: 'Active',
      networks: [
        {
          id: 'net-1',
          name: 'Main VPC',
          subnets: ['10.0.0.0/24', '10.0.1.0/24'],
        }
      ],
      virtualMachines: [
        {
          id: 'vm-1',
          name: 'Web Server',
          networkId: 'net-1',
          status: 'Active',
          type: 't2.micro',
          os: 'Ubuntu',
          cpu: '2 vCPU',
          ram: '4 GB',
          diskSize: 100
        }
      ],
      dataDisks: [
        {
          id: 'disk-1',
          name: 'Database Storage',
          size: 500
        }
      ]
    }
  ],
  selectedProject: null,
  
  addProject: (projectData) => set((state) => {
    const newProject: Project = {
      ...projectData,
      id: `project-${Math.random().toString(36).substr(2, 9)}`,
      networks: [],
      virtualMachines: [],
      dataDisks: []
    };
    return { projects: [...state.projects, newProject] };
  }),
  
  setSelectedProject: (projectId) => set((state) => {
    const project = state.projects.find(p => p.id === projectId) || null;
    return { selectedProject: project };
  }),
  
  addNetwork: (projectId, networkData) => set((state) => {
    const projects = [...state.projects];
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex >= 0) {
      const newNetwork = {
        ...networkData,
        id: `net-${Math.random().toString(36).substr(2, 9)}`,
      };
      
      projects[projectIndex] = {
        ...projects[projectIndex],
        networks: [...projects[projectIndex].networks, newNetwork]
      };
      
      // Update selected project if it's the one being modified
      const selectedProject = state.selectedProject && state.selectedProject.id === projectId
        ? projects[projectIndex]
        : state.selectedProject;
      
      return { projects, selectedProject };
    }
    return state;
  }),
  
  addVirtualMachine: (projectId, vmData) => set((state) => {
    const projects = [...state.projects];
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex >= 0) {
      const newVM = {
        ...vmData,
        id: `vm-${Math.random().toString(36).substr(2, 9)}`,
      };
      
      projects[projectIndex] = {
        ...projects[projectIndex],
        virtualMachines: [...projects[projectIndex].virtualMachines, newVM]
      };
      
      // Update selected project if it's the one being modified
      const selectedProject = state.selectedProject && state.selectedProject.id === projectId
        ? projects[projectIndex]
        : state.selectedProject;
      
      return { projects, selectedProject };
    }
    return state;
  }),
  
  addDataDisk: (projectId, diskData) => set((state) => {
    const projects = [...state.projects];
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex >= 0) {
      const newDisk = {
        ...diskData,
        id: `disk-${Math.random().toString(36).substr(2, 9)}`,
      };
      
      projects[projectIndex] = {
        ...projects[projectIndex],
        dataDisks: [...projects[projectIndex].dataDisks, newDisk]
      };
      
      // Update selected project if it's the one being modified
      const selectedProject = state.selectedProject && state.selectedProject.id === projectId
        ? projects[projectIndex]
        : state.selectedProject;
      
      return { projects, selectedProject };
    }
    return state;
  }),
})); 