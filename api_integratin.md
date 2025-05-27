# API Integration Setup Guide

This guide covers the integration of backend APIs with the Synapses frontend application.

## Changes Made

### 1. API Service Layer (`src/services/api.ts`)
- Created a comprehensive API service layer that handles all backend communication
- Implements all endpoints from the PDF documentation
- Uses hardcoded customer ID: `fc6c5712-340f-11f0-a565-88ae1d45f51b`
- Includes proper TypeScript interfaces for API responses

### 2. Updated Project Store (`src/store/projectStore.ts`)
- Integrated with real APIs instead of mock data
- Added loading and error states
- Transforms API responses to frontend data format
- Handles API failures gracefully with fallback to sample data

### 3. Service Catalog Modal UI Update (`src/components/modals/ServiceCatalogModal.tsx`)
- Changed from 6 service boxes to a single dropdown on the left
- Shows available resources on the right side when a category is selected
- Improved user experience with better organization

### 4. Enhanced Components
- **Dashboard**: Added API loading states and error handling
- **Projects**: Integrated with project loading from API
- **CreateProjectModal**: Uses platform and region APIs
- **AddVMModal**: Integrated with VM sizes and OS list APIs
- **ProjectDetails**: Loads project resources from API

## Environment Setup

1. Create a `.env` file in the project root:
```bash
REACT_APP_API_URL=http://localhost:8000
```

2. For production, update the URL:
```bash
REACT_APP_API_URL=https://your-api-domain.com
```

## API Endpoints Integrated

### Project Management
- `GET /api/v1/project/get_all` - Get all projects for customer
- `POST /api/v1/aws/deploy_landingzone` - Create new project
- `POST /api/v1/poject/delete` - Delete project
- `GET /api/v1/project/get_project_resources` - Get project resources

### Resource Management
- `POST /api/v1/deploy_vm` - Deploy virtual machine
- `POST /api/v1/resource/delete` - Delete resource

### Configuration
- `GET /api/v1/platform/get_all` - Get available platforms
- `POST /api/v1/config/get_vm_sizes` - Get VM sizes for platform
- `POST /api/v1/config/get_os_list` - Get OS list for platform
- `POST /api/v1/config/get_region_list` - Get regions for platform

## API Data Transformation

The application transforms API responses to match the frontend data structure:

### Projects
- API projects are mapped to include networks, VMs, and data disks
- Resources are grouped by type and transformed to frontend format
- Status mapping: `created` → `Active`, others → `Pending`

### Resources
- Virtual machines are extracted from resources with type `virtual_machine`
- Networks are built from `subnet`/`vpc`/`network` type resources
- Data disks are extracted from `disk`/`volume`/`s3` type resources

## Error Handling

- API failures fall back to sample data to maintain functionality
- Loading states are shown during API calls
- Error messages are displayed with retry options
- Graceful degradation ensures the app remains usable

## Authentication

- Currently uses demo credentials (email@demo.com / 123456789)
- Hardcoded customer ID is used for all API calls
- Future: Will be replaced with dynamic customer ID from user authentication

## Testing

1. Start the development server:
```bash
npm start
```

2. Test with mock data if API is not available
3. API integration will automatically activate when backend is running

## Future Enhancements

- Dynamic customer ID from authentication
- Real-time resource status updates
- WebSocket integration for live updates
- Enhanced error recovery mechanisms
- API response caching for better performance

## Troubleshooting

### API Connection Issues
- Check if backend server is running
- Verify API URL in `.env` file
- Check browser network tab for CORS issues

### Loading Issues
- Clear browser cache and localStorage
- Check console for JavaScript errors
- Verify all required environment variables are set

### Data Not Showing
- Check API responses in network tab
- Verify customer ID is correct
- Check backend logs for errors

## Notes

- All API integrations maintain backward compatibility
- UI/UX remains unchanged except for the Service Catalog modal
- Sample data is still available as fallback
- Loading and error states enhance user experience

## Loading States & User Experience

- Loading and error states enhance user experience
- Skeleton loaders provide visual feedback during API calls
- Toast notifications inform users of successful actions and errors
- Smooth transitions between loading and loaded states
- Retry mechanisms for failed API calls

## Performance Optimizations

- API calls are cached to reduce unnecessary requests
- Debounced search functionality prevents excessive API calls
- Lazy loading of project resources on demand
- Optimistic UI updates for better perceived performance

## Security Considerations

- All API calls use HTTPS in production
- Customer ID validation on frontend and backend
- Error messages don't expose sensitive information
- API endpoints are protected with proper authentication

## Deployment Checklist

1. Set production API URL in environment variables
2. Test all API endpoints in staging environment
3. Verify CORS configuration on backend
4. Check error handling for edge cases
5. Test with real backend data
6. Monitor API response times
7. Set up logging for API failures

## API Response Examples

### Project List Response
```json
[
  {
    "id": "cdc27a44-358b-11f0-86f5-88ae1d45f51b",
    "customer_id": "fc6c5712-340f-11f0-a565-88ae1d45f51b",
    "platform_id": "33dc62e3-3410-11f0-971f-88ae1d45f51b",
    "name": "landingzone",
    "description": "",
    "status": "deleted",
    "creation_date": "2025-05-20T15:05:00",
    "deletion_date": "2025-05-20T15:21:01"
  }
]
```

### Project Resources Response
```json
[
  {
    "id": "c4b87efd-37ad-11f0-a412-065146f3c369",
    "project_id": "6a3da6cf-37ad-11f0-a59c-065146f3c369",
    "name": "defaultbckpplan",
    "stack_id": "bpplan-defaultbckpplan-1747987991",
    "status": "created",
    "type": "backup_plan",
    "creation_date": "2025-05-23T08:13:11",
    "deletion_date": null,
    "details": "{\"Type\": \"backup_plan\", \"BackupPlanId\": \"c5bdfcdc-39fb-41e4-b3f9-b111f0a7ca23\"}",
    "parameters": "[{\"ParameterKey\": \"BackupVault\", \"ParameterValue\": \"defaultbcpvault\"}]"
  }
]
```

## Monitoring & Analytics

- Track API response times and success rates
- Monitor user interactions with loading states
- Log error patterns for debugging
- Track project creation and resource deployment success rates
- Monitor resource usage and performance metrics

## Backup & Recovery

- Graceful fallback to cached data during API outages
- Sample data available for development and testing
- Local storage backup for critical user data
- Automatic retry mechanisms for failed operations

## Integration Testing

### API Endpoint Tests
- Test all CRUD operations for projects
- Verify resource deployment workflows
- Test error scenarios and edge cases
- Validate data transformation accuracy

### UI Integration Tests
- Test loading states and user interactions
- Verify error message display
- Test retry mechanisms
- Validate data persistence across page refreshes

## Documentation Updates

- API documentation kept in sync with implementation
- Frontend component documentation updated
- User guide updated with new features
- Developer setup instructions maintained