# Admin Project Management - Installation & Usage Guide

## Quick Start

### Prerequisites

- Node.js v18+ installed
- MongoDB running and connected
- Backend server running on port 3000
- Frontend development server configured

### Installation

No additional installations needed! All dependencies are already included in `package.json`.

To verify dependencies are installed:

```bash
# Navigate to client directory
cd client

# Install if needed
npm install

# Start development server
npm run dev
```

## Accessing the Feature

### Via Browser

1. Navigate to: `http://localhost:5173/admin/projects`
   - Or use the sidebar menu: **Projects** (under admin dashboard)

### Route Structure

- **Main Page**: `/admin/projects`
- **AdminProjectPage Component**: `client/src/pages/AdminProjectPage.jsx`
- **Related Components**:
  - `ProjectForm`: `client/src/components/admin/ProjectForm.jsx`
  - `ProjectList`: `client/src/components/admin/ProjectList.jsx`

## UI/UX Guide

### Header Section

- Page title: "Project Management"
- Subtitle explaining functionality
- Statistics dashboard showing:
  - Total Projects
  - Ongoing Projects
  - Completed Projects
  - Active Regions
  - Total Budget (in millions)

### Adding a Project

1. Click **"Add New Project"** button
2. Fill in all required fields:
   - **Project Information**: Name, ID, Type of Work
   - **Location**: Region, Legislative District, DEO, Coordinates (Longitude/Latitude)
   - **Contract Details**: Contract ID, Contractor Name
   - **Budget**: Approved Budget, Contract Cost
   - **Timeline**: Start Date, Funding Year
   - **Status**: Dropdown selection (Ongoing, Pending, Finished, Cancelled)
3. Form provides real-time validation feedback
4. Click **"Add Project"** to submit
5. Success message displays with project details
6. Form resets automatically
7. New project appears in the list

### Project List Features

#### Searching

- Type in search box to find by:
  - Project Name
  - Project ID
  - Contractor Name

#### Filtering

- **Status Filter**: Show only projects with specific status
- **Region Filter**: Filter by geographic region
- **Contractor Filter**: Show projects by specific contractor

#### Sorting

- Click any column header to sort:
  - Project Name
  - Region
  - Budget
  - Start Date
  - Status
- Click again to reverse sort order
- Arrow indicators (▲/▼) show current sort direction

#### Table Information

- **Project**: Name and unique ID
- **Region**: Geographic location and legislative district
- **Contractor**: Contractor name and infrastructure type
- **Status**: Color-coded status badge
- **Budget**: Approved budget and contract cost in PHP currency
- **Start Date**: Project start date formatted

## Form Field Details

### Required Fields (All marked with \*)

```
Project Details:
- Project Name (text): e.g., "Flood Control System Phase 1"
- Project ID (text): Unique identifier, e.g., "PROJ-2024-001"
- Region (text): e.g., "Metro Manila"
- Legislative District (text): e.g., "District 1"
- District Engineering Office (text): e.g., "DPWH Metro Manila"

Work Details:
- Type of Work (text): e.g., "Construction"
- Infrastructure Type (text): e.g., "Pumping Station"

Location (Coordinates):
- Longitude (number): e.g., "120.9842"
- Latitude (number): e.g., "14.5995"

Contract Information:
- Contract ID (text): Unique, e.g., "CONT-2024-001"
- Contractor Name (text): e.g., "ABC Construction Co."

Budget:
- Approved Budget (number): in Philippine Pesos
- Contract Cost (number): in Philippine Pesos

Timeline:
- Start Date (date): Project commencement date
- Funding Year (number): Year of allocation, e.g., "2024"

Status (dropdown):
- Ongoing (default)
- Pending
- Finished
- Cancelled
```

## API Integration

### Backend Endpoints Used

**GET /api/projects**

```bash
# Get all projects
GET /api/projects

# Filter by status
GET /api/projects?status=ongoing

# Filter by region
GET /api/projects?region=Metro%20Manila

# Filter by contractor
GET /api/projects?contractor_name=ABC

# Combine multiple filters
GET /api/projects?status=ongoing&region=Metro%20Manila
```

**POST /api/projects**

```bash
# Create new project
POST /api/projects
Content-Type: application/json

{
  "project_name": "Flood Control System",
  "region": "Metro Manila",
  "legislative_district": "District 1",
  "district_engineering_office": "DPWH Metro Manila",
  "project_id": "PROJ-2024-001",
  "type_of_work": "Construction",
  "infrastructure_type": "Pumping Station",
  "longitude": 120.9842,
  "latitude": 14.5995,
  "contract_id": "CONT-2024-001",
  "approved_budget": 10000000,
  "contract_cost": 9500000,
  "start_date": "2024-01-15",
  "funding_year": 2024,
  "contractor_name": "ABC Construction Co.",
  "status": "ongoing"
}
```

## Error Handling

### Common Errors & Solutions

**Project Already Exists**

- Error: "Project with this ID or contract ID already exists"
- Solution: Use unique Project ID and Contract ID

**Validation Errors**

- Error: Specific field validation failure
- Solution: Check field requirements (numbers, dates, text)
- Form displays red highlight on invalid fields

**Network Error**

- Error: "Failed to create project"
- Solution: Check backend server is running on port 3000

**Server Error**

- Error: "Internal server error"
- Solution: Check MongoDB connection and backend logs

## Success Indicators

✅ **Project Created Successfully**

- Green alert appears with project name, region, and budget
- Auto-dismisses after 5 seconds
- New project immediately visible in list

✅ **Filters Working**

- Project count updates when filters applied
- Table shows only matching projects
- Counter shows "Showing X of Y projects"

✅ **Sorting Working**

- Column headers clickable
- Arrow indicators show sort direction
- Projects reorder based on selected field

## Best Practices

1. **Data Entry**

   - Ensure unique Project IDs and Contract IDs
   - Use consistent region naming
   - Double-check geographic coordinates
   - Verify budget amounts before submission

2. **Project Management**

   - Regularly update project status
   - Monitor budget vs. contract cost discrepancies
   - Use filtering to track projects by status or region
   - Search for contractors to view all their projects

3. **Performance**
   - Use filters to reduce list size on large datasets
   - Search instead of scrolling through long lists
   - Sort by relevant fields to find projects quickly

## Troubleshooting

### Projects Not Loading

1. Check backend server running: `http://localhost:3000`
2. Verify MongoDB is connected
3. Check browser console for errors (F12 > Console)

### Filters Not Working

1. Verify API is responding to query parameters
2. Check exact spelling of region/contractor names
3. Try clearing search box

### Form Not Submitting

1. Check all required fields are filled (marked with \*)
2. Verify validation messages
3. Check browser console for JavaScript errors
4. Ensure backend API is responding

### Styling Issues

1. Clear browser cache (Ctrl+Shift+Delete)
2. Reload page (Ctrl+F5)
3. Check Tailwind CSS is properly configured

## File Locations Reference

```
Project Management Files:
├── client/src/
│   ├── pages/
│   │   └── AdminProjectPage.jsx          (Main page)
│   ├── components/admin/
│   │   ├── ProjectForm.jsx               (Form component)
│   │   └── ProjectList.jsx               (List component)
│   ├── layout/
│   │   └── AdminLayout.jsx               (Layout wrapper)
│   └── App.jsx                            (Route definition)
├── server/
│   ├── controllers/
│   │   └── projectController.js          (Updated with filters)
│   ├── routes/
│   │   └── projects.js                   (Project routes)
│   └── models/
│       └── Project.js                    (Database schema)
```

## Performance Notes

- **Project List**: Dynamically filters on client-side (fast for <1000 items)
- **Sorting**: Client-side sorting with useMemo optimization
- **API Calls**: Minimal requests, efficient filtering
- **Search**: Real-time search with no debounce needed for current data size

## Security Considerations

- ✅ Backend validates all input
- ✅ Form prevents XSS via React
- ✅ Database enforces unique constraints
- ✅ Server handles duplicate ID attempts gracefully
- ✅ API properly formatted responses

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Additional Resources

- Lucide React Icons: https://lucide.dev
- Tailwind CSS: https://tailwindcss.com
- React Documentation: https://react.dev
- MongoDB Documentation: https://docs.mongodb.com
