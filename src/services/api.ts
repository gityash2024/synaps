// API service layer for backend integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Hardcoded customer ID as requested
export const CUSTOMER_ID = 'fc6c5712-340f-11f0-a565-88ae1d45f51b';

// API response types based on PDF documentation
export interface ApiProject {
  id: string;
  customer_id: string;
  platform_id: string;
  region_id: string;
  name: string;
  description: string;
  status: string;
  creation_date: string;
  deletion_date: any;
}

export interface ApiProjectResource {
  id: string;
  project_id: string;
  name: string;
  stack_id: string;
  status: string;
  type: string;
  creation_date: string;
  deletion_date: string | null;
  details: string;
  parameters: string;
}

export interface ApiPlatform {
  id: string;
  type: string;
  display_name: string;
  description: string;
}

export interface ApiVMSize {
  id: string;
  Display_name: string;
  platform_id: string;
  value: string;
}

export interface ApiOS {
  id: string;
  Display_name: string;
  platform_id: string;
  type: string;
  value: string;
}

export interface ApiRegion {
  id: string;
  display_name: string;
  platform_id: string;
  value: string;
}

// API service class
class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all projects for customer
  async getProjects(): Promise<ApiProject[]> {
    return this.request<ApiProject[]>('/api/v1/project/get_all', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: CUSTOMER_ID
      })
    });
  }

  // Get project resources
  async getProjectResources(projectId: string): Promise<ApiProjectResource[]> {
    return this.request<ApiProjectResource[]>('/api/v1/project/get_project_resources', {
      method: 'POST',
      body: JSON.stringify({
        project_id: projectId
      })
    });
  }

  // Create new project (AWS example)
  async createProject(data: {
    platform_id: string;
    region_id: string;
    project_name: string;
    project_type: string;
    owner: string;
    billing_org: string;
    description: string;
  }): Promise<{ message: string; status: string }> {
    return this.request<{ message: string; status: string }>('/api/v1/project/create', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: CUSTOMER_ID,
        ...data
      })
    });
  }

  // Delete project
  async deleteProject(projectId: string): Promise<{ message: string; status: string }> {
    return this.request<{ message: string; status: string }>('/api/v1/poject/delete', {
      method: 'POST',
      body: JSON.stringify({
        project_id: projectId
      })
    });
  }

  // Deploy VM
  async deployVM(data: {
    project_id: string;
    name: string;
    instance_type: string;
    os_id: string;
    public_ip: string;
    data_disk: string;
    data_disk_size?: string;
    key_pair: string;
    subnet_id: string;
    security_group_id: string;
    platform_id: string;
  }): Promise<void> {
    // This is an async endpoint with no response as per PDF
    await this.request('/api/v1/deploy_vm', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Delete resource
  async deleteResource(projectId: string, resourceId: string): Promise<{ message: string; status: string }> {
    return this.request<{ message: string; status: string }>('/api/v1/resource/delete', {
      method: 'POST',
      body: JSON.stringify({
        project_id: projectId,
        id: resourceId
      })
    });
  }

  // Get platform list
  async getPlatforms(): Promise<ApiPlatform[]> {
    return this.request<ApiPlatform[]>('/api/v1/platform/get_all', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: CUSTOMER_ID
      })
    });
  }

  // Get VM sizes
  async getVMSizes(platformId: string): Promise<ApiVMSize[]> {
    return this.request<ApiVMSize[]>('/api/v1/config/get_vm_sizes', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: CUSTOMER_ID,
        platform_id: platformId
      })
    });
  }

  // Get OS list
  async getOSList(platformId: string): Promise<ApiOS[]> {
    return this.request<ApiOS[]>('/api/v1/config/get_os_list', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: CUSTOMER_ID,
        platform_id: platformId
      })
    });
  }

  // Get region list
  async getRegionList(platformId: string): Promise<ApiRegion[]> {
    return this.request<ApiRegion[]>('/api/v1/config/get_region_list', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: CUSTOMER_ID,
        platform_id: platformId
      })
    });
  }

  // Get subnet list
  async getSubnetList(platformId: string, regionId: string): Promise<any[]> {
    return this.request<any[]>('/api/v1/config/get_subnet_list', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: CUSTOMER_ID,
        platform_id: platformId,
        region_id: regionId
      })
    });
  }

  // Get security group list
  async getSecurityGroupList(platformId: string, regionId: string): Promise<any[]> {
    return this.request<any[]>('/api/v1/config/get_security_group_list', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: CUSTOMER_ID,
        platform_id: platformId,
        region_id: regionId
      })
    });
  }
}

export const apiService = new ApiService();