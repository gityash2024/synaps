import { create } from 'zustand';
import { apiService, ApiProject, ApiProjectResource } from '../services/api';

export type Platform = 'AWS' | 'Azure' | 'Private Cloud' | 'VMware';
export type OSType = 'Ubuntu' | 'Windows Server';
export type Status = 'Active' | 'Inactive' | 'Pending';

// Mock backend data - will come from API in real implementation
export const mockPlatforms: Platform[] = ['AWS', 'Azure', 'Private Cloud', 'VMware'];
export const mockRegions = {
  'AWS': ['us-east-1', 'us-west-1', 'eu-west-1', 'ap-southeast-1'],
  'Azure': ['eastus', 'westus', 'westeurope', 'southeastasia'],
  'Private Cloud': ['dc-1', 'dc-2', 'dc-3'],
  'VMware': ['cluster-1', 'cluster-2', 'cluster-3']
};

export type ProjectType = 'default' | 'custom';

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
  region?: string;
  projectType?: ProjectType;
  billingOrganization: string;
  owner: string;
  status: Status;
  networks: Network[];
  virtualMachines: VirtualMachine[];
  dataDisks: DataDisk[];
  // Additional fields from API
  platformId?: string;
  regionId?: string;
  creationDate?: string;
  deletionDate?: string | null;
}

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  platforms: any[];
  regions: any[];
  vmSizes: any[];
  osList: any[];
  
  // Actions
  loadProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'networks' | 'virtualMachines' | 'dataDisks'>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  setSelectedProject: (projectId: string) => Promise<void>;
  addNetwork: (projectId: string, network: Omit<Network, 'id'>) => void;
  addVirtualMachine: (projectId: string, vm: Omit<VirtualMachine, 'id'>) => Promise<void>;
  addDataDisk: (projectId: string, disk: Omit<DataDisk, 'id'>) => void;
  removeResource: (projectId: string, resourceType: 'network' | 'virtualMachine' | 'dataDisk', resourceId: string) => Promise<void>;
  
  // Configuration loaders
  loadPlatforms: () => Promise<void>;
  loadRegions: (platformId: string) => Promise<void>;
  loadVMSizes: (platformId: string) => Promise<void>;
  loadOSList: (platformId: string) => Promise<void>;
}

// Helper functions to transform API data to frontend format
const transformApiProjectToProject = (apiProject: ApiProject, resources: ApiProjectResource[] = []): Project => {
  // Group resources by type
  const networks: Network[] = [];
  const virtualMachines: VirtualMachine[] = [];
  const dataDisks: DataDisk[] = [];

  resources.forEach(resource => {
    switch (resource.type) {
      case 'subnet':
      case 'vpc':
      case 'network':
        // Try to find existing network or create new one
        let network = networks.find(n => n.name === resource.name || n.id === resource.id);
        if (!network) {
          network = {
            id: resource.id,
            name: resource.name,
            subnets: []
          };
          networks.push(network);
        }
        
        // Parse details to get subnet info
        try {
          const details = JSON.parse(resource.details);
          if (details.CIDR) {
            network.subnets.push(details.CIDR);
          }
        } catch (e) {
          // If parsing fails, just use the name
          if (resource.type === 'subnet') {
            network.subnets.push(resource.name);
          }
        }
        break;
        
      case 'virtual_machine':
      case 'vm':
        try {
          const details = JSON.parse(resource.details);
          const params = JSON.parse(resource.parameters);
          
          virtualMachines.push({
            id: resource.id,
            name: resource.name,
            networkId: params.find((p: any) => p.ParameterKey === 'SubnetId')?.ParameterValue || '',
            status: resource.status === 'created' ? 'Active' : 'Pending',
            type: details.InstanceType || 'Unknown',
            os: details.OsType === 'linux' ? 'Ubuntu' : 'Windows Server',
            cpu: '2 vCPU', // Default, could be derived from InstanceType
            ram: '4 GB', // Default, could be derived from InstanceType  
            diskSize: parseInt(details.DataEBSSize) || 20
          });
        } catch (e) {
          // Fallback if parsing fails
          virtualMachines.push({
            id: resource.id,
            name: resource.name,
            networkId: '',
            status: resource.status === 'created' ? 'Active' : 'Pending',
            type: 'Unknown',
            os: 'Ubuntu',
            cpu: '2 vCPU',
            ram: '4 GB',
            diskSize: 20
          });
        }
        break;
        
      case 'disk':
      case 'volume':
      case 's3':
        try {
          const details = JSON.parse(resource.details);
          dataDisks.push({
            id: resource.id,
            name: resource.name,
            size: parseInt(details.Size) || 100
          });
        } catch (e) {
          dataDisks.push({
            id: resource.id,
            name: resource.name,
            size: 100
          });
        }
        break;
    }
  });

  return {
    id: apiProject.id,
    name: apiProject.name,
    description: apiProject.description,
    platform: 'AWS', // Default, should be derived from platform_id
    region: 'us-east-1', // Default, should be derived from API
    projectType: 'default',
    billingOrganization: 'Demo Organization',
    owner: 'Demo User',
    status: apiProject.status === 'active' ? 'Active' : apiProject.status === 'inactive' ? 'Inactive' : 'Pending',
    networks,
    virtualMachines,
    dataDisks,
    platformId: apiProject.platform_id,
    creationDate: apiProject.creation_date,
    deletionDate: apiProject.deletion_date
  };
};

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  platforms: [],
  regions: [],
  vmSizes: [],
  osList: [],

  loadProjects: async () => {
    set({ loading: true, error: null });
    try {
      const apiProjects = await apiService.getProjects();
      
      // Load resources for each project
      const projectsWithResources = await Promise.all(
        apiProjects.map(async (apiProject) => {
          try {
            const resources = await apiService.getProjectResources(apiProject.id);
            return transformApiProjectToProject(apiProject, resources);
          } catch (error) {
            // If loading resources fails, return project without resources
            return transformApiProjectToProject(apiProject, []);
          }
        })
      );
      
      set({ projects: projectsWithResources, loading: false });
    } catch (error) {
      console.error('Failed to load projects:', error);
      set({ 
        error: 'Failed to load projects', 
        loading: false,
        // Fallback to sample data if API fails
        projects: [
          {
            id: '1',
            name: 'Sample Cloud Project',
            description: 'A sample cloud infrastructure project',
            platform: 'AWS',
            region: 'us-east-1',
            projectType: 'default',
            billingOrganization: 'Demo Organization',
            owner: 'Synapses User',
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
        ]
      });
    }
  },
  
  addProject: async (projectData) => {
    set({ loading: true, error: null });
    try {
      // For now, we need to map frontend data to API format
      // This would need platform_id and region_id from the API
      const response = await apiService.createProject({
        platform_id: '33dc62e3-3410-11f0-971f-88ae1d45f51b', // Default AWS platform ID
        region_id: '33dc6277-3410-11f0-881f-88ae1d45f51b', // Default region ID
        project_name: projectData.name,
        project_type: projectData.projectType || 'default',
        owner: projectData.owner,
        billing_org: projectData.billingOrganization,
        description: projectData.description
      });
      
      if (response.status === '200') {
        // Reload projects to get the updated list
        await get().loadProjects();
      } else {
        throw new Error(response.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      set({ error: 'Failed to create project', loading: false });
      
      // Fallback to local creation for demo
      const newProject: Project = {
        ...projectData,
        id: `project-${Math.random().toString(36).substr(2, 9)}`,
        networks: [],
        virtualMachines: [],
        dataDisks: []
      };
      set(state => ({ 
        projects: [...state.projects, newProject],
        loading: false,
        error: null
      }));
    }
  },
  
  deleteProject: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.deleteProject(projectId);
      
      if (response.status === '200') {
        set(state => {
          const updatedProjects = state.projects.filter(project => project.id !== projectId);
          const updatedSelectedProject = state.selectedProject && state.selectedProject.id === projectId 
            ? null 
            : state.selectedProject;
          
          return { 
            projects: updatedProjects,
            selectedProject: updatedSelectedProject,
            loading: false
          };
        });
      } else {
        throw new Error(response.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      set({ error: 'Failed to delete project', loading: false });
    }
  },
  
  setSelectedProject: async (projectId) => {
    const project = get().projects.find(p => p.id === projectId);
    if (project) {
      set({ selectedProject: project });
      // Optionally reload project resources
      try {
        const resources = await apiService.getProjectResources(projectId);
        const updatedProject = transformApiProjectToProject(
          {
            id: project.id,
            customer_id: '',
            platform_id: project.platformId || '',
            name: project.name,
            description: project.description,
            status: project.status.toLowerCase(),
            creation_date: project.creationDate || '',
            deletion_date: project.deletionDate
          },
          resources
        );
        set({ selectedProject: updatedProject });
      } catch (error) {
        console.error('Failed to reload project resources:', error);
      }
    } else {
      set({ selectedProject: null });
    }
  },
  
  addNetwork: (projectId, networkData) => {
    // This is handled locally for now as there's no specific network creation API in the PDF
    set(state => {
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
        
        const selectedProject = state.selectedProject && state.selectedProject.id === projectId
          ? projects[projectIndex]
          : state.selectedProject;
        
        return { projects, selectedProject };
      }
      return state;
    });
  },
  
  addVirtualMachine: async (projectId, vmData) => {
    set({ loading: true, error: null });
    try {
      // Deploy VM using API
      await apiService.deployVM({
        project_id: projectId,
        name: vmData.name,
        instance_type: '6199d218-3564-11f0-b0f3-88ae1d45f51b', // Default instance type ID
        os_id: '6199d218-3564-11f0-b0f3-88ae1d45f51b', // Default OS ID
        public_ip: 'true',
        data_disk: vmData.diskSize > 0 ? 'true' : 'false',
        data_disk_size: vmData.diskSize.toString(),
        key_pair: 'synapses',
        subnet_id: vmData.networkId,
        security_group_id: '6199d218-3564-11' // Default security group
      });
      
      // Add locally (since API is async)
      set(state => {
        const projects = [...state.projects];
        const projectIndex = projects.findIndex(p => p.id === projectId);
        
        if (projectIndex >= 0) {
          const newVM = {
            ...vmData,
            id: `vm-${Math.random().toString(36).substr(2, 9)}`,
            status: 'Pending' as Status
          };
          
          projects[projectIndex] = {
            ...projects[projectIndex],
            virtualMachines: [...projects[projectIndex].virtualMachines, newVM]
          };
          
          const selectedProject = state.selectedProject && state.selectedProject.id === projectId
            ? projects[projectIndex]
            : state.selectedProject;
          
          return { projects, selectedProject, loading: false };
        }
        return { ...state, loading: false };
      });
    } catch (error) {
      console.error('Failed to deploy VM:', error);
      set({ error: 'Failed to deploy VM', loading: false });
    }
  },
  
  addDataDisk: (projectId, diskData) => {
    // Handle locally for now
    set(state => {
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
        
        const selectedProject = state.selectedProject && state.selectedProject.id === projectId
          ? projects[projectIndex]
          : state.selectedProject;
        
        return { projects, selectedProject };
      }
      return state;
    });
  },
  
  removeResource: async (projectId, resourceType, resourceId) => {
    try {
      // Try to delete via API
      await apiService.deleteResource(projectId, resourceId);
    } catch (error) {
      console.error('Failed to delete resource via API:', error);
    }
    
    // Remove locally regardless of API result
    set(state => {
      const projects = [...state.projects];
      const projectIndex = projects.findIndex(p => p.id === projectId);
      
      if (projectIndex >= 0) {
        if (resourceType === 'network') {
          projects[projectIndex] = {
            ...projects[projectIndex],
            networks: projects[projectIndex].networks.filter(net => net.id !== resourceId)
          };
        } else if (resourceType === 'virtualMachine') {
          projects[projectIndex] = {
            ...projects[projectIndex],
            virtualMachines: projects[projectIndex].virtualMachines.filter(vm => vm.id !== resourceId)
          };
        } else if (resourceType === 'dataDisk') {
          projects[projectIndex] = {
            ...projects[projectIndex],
            dataDisks: projects[projectIndex].dataDisks.filter(disk => disk.id !== resourceId)
          };
        }
        
        const selectedProject = state.selectedProject && state.selectedProject.id === projectId
          ? projects[projectIndex]
          : state.selectedProject;
        
        return { projects, selectedProject };
      }
      return state;
    });
  },

  loadPlatforms: async () => {
    try {
      const platforms = await apiService.getPlatforms();
      set({ platforms });
    } catch (error) {
      console.error('Failed to load platforms:', error);
      // Fallback to mock data
      set({ platforms: mockPlatforms.map(p => ({ id: p, name: p })) });
    }
  },

  loadRegions: async (platformId: string) => {
    try {
      const regions = await apiService.getRegionList(platformId);
      set({ regions });
    } catch (error) {
      console.error('Failed to load regions:', error);
      set({ regions: [] });
    }
  },

  loadVMSizes: async (platformId: string) => {
    try {
      const vmSizes = await apiService.getVMSizes(platformId);
      set({ vmSizes });
    } catch (error) {
      console.error('Failed to load VM sizes:', error);
      set({ vmSizes: [] });
    }
  },

  loadOSList: async (platformId: string) => {
    try {
      const osList = await apiService.getOSList(platformId);
      set({ osList });
    } catch (error) {
      console.error('Failed to load OS list:', error);
      set({ osList: [] });
    }
  }
}));