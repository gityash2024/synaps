import { create } from 'zustand';
import { apiService, ApiProject, ApiProjectResource } from '../services/api';

export type Platform = 'AWS' | 'Azure' | 'Private Cloud' | 'VMware';
export type OSType = 'Ubuntu' | 'Windows Server';
export type Status = 'Active' | 'Inactive' | 'Pending';

export type ProjectType = 'default' | 'custom';

export interface Network {
  id: string;
  name: string;
  subnets: string[];
  status: string;
}

export interface VirtualMachine {
  id: string;
  name: string;
  networkId: string;
  status: string;
  type: string;
  os: OSType;
  cpu: string;
  ram: string;
  diskSize: number | null;
  details?: string;
}

export interface DataDisk {
  id: string;
  name: string;
  size: number;
}

// New interfaces for security and backup resources
export interface SecurityResource {
  id: string;
  name: string;
  type: string; // kms_key, security_group, etc.
  status: string;
  details: any;
  creationDate: string;
}

export interface BackupResource {
  id: string;
  name: string;
  type: string; // backup_plan, backup_vault, backup_selection
  status: string;
  details: any;
  creationDate: string;
}

export interface StorageResource {
  id: string;
  name: string;
  type: string; // s3, etc.
  status: string;
  details: any;
  creationDate: string;
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
  status: string; // Changed from Status to string to handle backend values
  networks: Network[];
  virtualMachines: VirtualMachine[];
  dataDisks: DataDisk[];
  securityResources: SecurityResource[];
  backupResources: BackupResource[];
  storageResources: StorageResource[];
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
  subnets: any[];
  securityGroups: any[];
  
  // Actions
  loadProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'networks' | 'virtualMachines' | 'dataDisks' | 'securityResources' | 'backupResources' | 'storageResources'>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  setSelectedProject: (projectId: string) => Promise<void>;
  addNetwork: (projectId: string, network: Omit<Network, 'id'>) => void;
  addVirtualMachine: (projectId: string, vm: Omit<VirtualMachine, 'id'>, vmConfig?: { instanceTypeId: string; osId: string; publicIp?: string; dataDisk?: string; dataDiskSize?: string; subnetId?: string; securityGroupId?: string }) => Promise<void>;
  addDataDisk: (projectId: string, disk: Omit<DataDisk, 'id'>) => void;
  removeResource: (projectId: string, resourceType: 'network' | 'virtualMachine' | 'dataDisk' | 'securityResource' | 'backupResource' | 'storageResource', resourceId: string) => Promise<void>;
  
  // Configuration loaders
  loadPlatforms: () => Promise<void>;
  loadRegions: (platformId: string) => Promise<void>;
  loadVMSizes: (platformId: string) => Promise<void>;
  loadOSList: (platformId: string) => Promise<void>;
  loadSubnets: (projectId: string) => Promise<void>;
  loadSecurityGroups: (projectId: string) => Promise<void>;
}

// Helper functions to transform API data to frontend format
const transformApiProjectToProject = (apiProject: ApiProject, resources: ApiProjectResource[] = [], platforms: any[] = [], regions: any[] = []): Project => {
  console.log('Transforming project:', { apiProject, platforms, regions });
  
  // Group resources by type
  const networks: Network[] = [];
  const virtualMachines: VirtualMachine[] = [];
  const dataDisks: DataDisk[] = [];
  const securityResources: SecurityResource[] = [];
  const backupResources: BackupResource[] = [];
  const storageResources: StorageResource[] = [];

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
            subnets: [],
            status: resource.status
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
            status: resource.status,
            type: details.InstanceType || '',
            os: details.OsType === 'linux' ? 'Ubuntu' : 'Windows Server',
            cpu: details.InstanceType ? '2 vCPU' : '', // Only show if instance type exists
            ram: details.InstanceType ? '4 GB' : '', // Only show if instance type exists
            diskSize: parseInt(details.DataEBSSize) || null,
            details: resource.details
          });
        } catch (e) {
          // Fallback if parsing fails
          virtualMachines.push({
            id: resource.id,
            name: resource.name,
            networkId: '',
            status: resource.status,
            type: '',
            os: 'Ubuntu',
            cpu: '',
            ram: '',
            diskSize: null,
            details: resource.details
          });
        }
        break;

      case 'kms_key':
      case 'security_group':
        securityResources.push({
          id: resource.id,
          name: resource.name,
          type: resource.type,
          status: resource.status,
          details: resource.details,
          creationDate: resource.creation_date
        });
        break;

      case 'backup_plan':
      case 'backup_vault':
      case 'backup_selection':
        backupResources.push({
          id: resource.id,
          name: resource.name,
          type: resource.type,
          status: resource.status,
          details: resource.details,
          creationDate: resource.creation_date
        });
        break;
        
      case 'disk':
      case 'volume':
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

      case 's3':
        storageResources.push({
          id: resource.id,
          name: resource.name,
          type: resource.type,
          status: resource.status,
          details: resource.details,
          creationDate: resource.creation_date
        });
        break;
    }
  });

  // Find platform and region names from dynamic data
  const platform = platforms.find(p => p.id === apiProject.platform_id);
  const region = regions.find(r => r.id === apiProject.region_id); // Fixed: should match region_id, not platform_id

  console.log('Platform and region mapping:', { 
    platformId: apiProject.platform_id, 
    regionId: apiProject.region_id,
    platform,
    region 
  });

  return {
    id: apiProject.id,
    name: apiProject.name,
    description: apiProject.description,
    platform: (platform?.display_name || platform?.type || 'AWS') as Platform,
    region: region?.display_name || region?.value || 'us-east-1',
    projectType: 'default',
    billingOrganization: 'Demo Organization',
    owner: 'Demo User',
    status: apiProject.status,
    networks,
    virtualMachines,
    dataDisks,
    securityResources,
    backupResources,
    storageResources,
    platformId: apiProject.platform_id,
    regionId: apiProject.region_id, // Ensure this is set from API
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
  subnets: [],
  securityGroups: [],

  loadProjects: async () => {
    set({ loading: true, error: null });
    try {
      // First, ensure platforms are loaded for mapping
      if (get().platforms.length === 0) {
        try {
          await get().loadPlatforms();
        } catch (error) {
          console.warn('Failed to load platforms, continuing with empty array');
        }
      }
      
      const apiProjects = await apiService.getProjects();
      console.log('Loaded projects from API:', apiProjects);
      
      // Load resources for each project
      const projectsWithResources = await Promise.all(
        apiProjects.map(async (apiProject) => {
          try {
            const resources = await apiService.getProjectResources(apiProject.id);
            return transformApiProjectToProject(apiProject, resources, get().platforms, get().regions);
          } catch (error) {
            // If loading resources fails, return project without resources
            return transformApiProjectToProject(apiProject, [], get().platforms, get().regions);
          }
        })
      );
      
      console.log('Transformed projects:', projectsWithResources);
      set({ projects: projectsWithResources, loading: false });
    } catch (error) {
      console.error('Failed to load projects:', error);
      set({ 
        error: 'Failed to load projects', 
        loading: false,
        projects: []  // Show empty state when backend is not running
      });
    }
  },
  
  addProject: async (projectData) => {
    set({ loading: true, error: null });
    try {
      // Use dynamic platform_id and region_id from the selected values
      const response = await apiService.createProject({
        platform_id: projectData.platformId || '',
        region_id: projectData.regionId || '',
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
      // Don't create project locally when backend is not running
      // Just show the error message to the user
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
    // Check if projects array is empty (likely on page refresh)
    if (get().projects.length === 0) {
      try {
        // Load all projects first
        await get().loadProjects();
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    }
    
    // Try to find the project after potentially loading all projects
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
            region_id: project.regionId || '',
            name: project.name,
            description: project.description,
            status: project.status.toLowerCase(),
            creation_date: project.creationDate || '',
            deletion_date: project.deletionDate
          },
          resources,
          get().platforms,
          get().regions
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
  
  addVirtualMachine: async (projectId, vmData, vmConfig) => {
    set({ loading: true, error: null });
    try {
      // Get current project to extract platformId and other needed IDs
      const currentProject = get().projects.find(p => p.id === projectId);
      if (!currentProject || !vmConfig) {
        throw new Error('Missing project information or VM configuration');
      }

      // Deploy VM using dynamic values from vmConfig
      await apiService.deployVM({
        project_id: projectId,
        name: vmData.name,
        instance_type: vmConfig.instanceTypeId,
        os_id: vmConfig.osId,
        public_ip: vmConfig.publicIp || 'true',
        data_disk: vmConfig.dataDisk || 'false',
        data_disk_size: vmConfig.dataDiskSize || '0',
        key_pair: 'synapses', // This could be made dynamic too if needed
        subnet_id: vmConfig.subnetId || vmData.networkId,
        security_group_id: vmConfig.securityGroupId || '', // This should come from API
        platform_id: currentProject.platformId || ''
      });
      
      // Add locally (since API is async)
      set(state => {
        const projects = [...state.projects];
        const projectIndex = projects.findIndex(p => p.id === projectId);
        
        if (projectIndex >= 0) {
          const newVM = {
            ...vmData,
            id: `vm-${Math.random().toString(36).substr(2, 9)}`,
            status: 'Pending'
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
        } else if (resourceType === 'securityResource') {
          projects[projectIndex] = {
            ...projects[projectIndex],
            securityResources: projects[projectIndex].securityResources.filter(sr => sr.id !== resourceId)
          };
        } else if (resourceType === 'backupResource') {
          projects[projectIndex] = {
            ...projects[projectIndex],
            backupResources: projects[projectIndex].backupResources.filter(br => br.id !== resourceId)
          };
        } else if (resourceType === 'storageResource') {
          projects[projectIndex] = {
            ...projects[projectIndex],
            storageResources: projects[projectIndex].storageResources.filter(sr => sr.id !== resourceId)
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
      // Fallback to empty array instead of mock data
      set({ platforms: [] });
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
    console.log('Loading VM sizes for platform:', platformId);
    try {
      const vmSizes = await apiService.getVMSizes(platformId);
      console.log('VM sizes API response:', vmSizes);
      set({ vmSizes });
    } catch (error) {
      console.error('Failed to load VM sizes:', error);
      // Return empty array when backend is not running
      set({ vmSizes: [] });
    }
  },

  loadOSList: async (platformId: string) => {
    console.log('Loading OS list for platform:', platformId);
    try {
      const osList = await apiService.getOSList(platformId);
      console.log('OS list API response:', osList);
      set({ osList });
    } catch (error) {
      console.error('Failed to load OS list:', error);
      // Return empty array when backend is not running
      set({ osList: [] });
    }
  },

  loadSubnets: async (projectId: string) => {
    console.log('Loading subnets for project:', projectId);
    try {
      const resources = await apiService.getProjectResources(projectId);
      console.log('Project resources for subnets:', resources);
      
      // Filter for subnet resources
      const subnets = resources
        .filter(resource => resource.type === 'subnet' || resource.type === 'network')
        .map(resource => ({
          id: resource.id,
          name: resource.name,
          project_id: resource.project_id,
          type: resource.type
        }));
      
      console.log('Filtered subnets:', subnets);
      set({ subnets });
    } catch (error) {
      console.error('Failed to load subnets:', error);
      // Return empty array when backend is not running
      set({ subnets: [] });
    }
  },

  loadSecurityGroups: async (projectId: string) => {
    console.log('Loading security groups for project:', projectId);
    try {
      const resources = await apiService.getProjectResources(projectId);
      console.log('Project resources for security groups:', resources);
      
      // Filter for security group resources
      const securityGroups = resources
        .filter(resource => resource.type === 'security_group')
        .map(resource => ({
          id: resource.id,
          name: resource.name,
          project_id: resource.project_id,
          type: resource.type
        }));
      
      console.log('Filtered security groups:', securityGroups);
      set({ securityGroups });
    } catch (error) {
      console.error('Failed to load security groups:', error);
      // Return empty array when backend is not running
      set({ securityGroups: [] });
    }
  }
}));