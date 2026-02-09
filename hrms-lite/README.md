# HRMS Lite - Human Resource Management System

A lightweight, full-stack web application for managing employee records and tracking daily attendance.

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel/Netlify - Add your URL here]
- **Backend API**: [Deployed on Render/Railway - Add your URL here]

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Assumptions & Limitations](#assumptions--limitations)

## ✨ Features

### Core Features

#### Employee Management
- ✅ Add new employees with unique Employee ID
- ✅ View all employees in a card-based layout
- ✅ Delete employees (with cascade deletion of attendance records)
- ✅ Validation for duplicate Employee IDs
- ✅ Email format validation

#### Attendance Management
- ✅ Mark daily attendance (Present/Absent)
- ✅ View all attendance records in table format
- ✅ Filter attendance by date
- ✅ Filter attendance by employee
- ✅ Automatic update if attendance already marked for a date
- ✅ Prevent duplicate attendance entries

### Bonus Features Implemented
- ✅ Dashboard with summary statistics
  - Total employees count
  - Today's attendance (Present, Absent, Not Marked)
  - Department-wise employee distribution
- ✅ Filter attendance records by date and employee
- ✅ Display total present/absent days per employee

### UI/UX Features
- ✅ Professional, clean, and modern interface
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states for async operations
- ✅ Empty states with helpful messages
- ✅ Error handling with user-friendly messages
- ✅ Intuitive navigation
- ✅ Confirmation dialogs for destructive actions

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Express Validator** - Request validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── models/
│   │   ├── Employee.js          # Employee schema
│   │   └── Attendance.js        # Attendance schema
│   ├── routes/
│   │   ├── employees.js         # Employee endpoints
│   │   ├── attendance.js        # Attendance endpoints
│   │   └── dashboard.js         # Dashboard stats endpoint
│   ├── server.js                # Express server & DB connection
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js           # API service layer
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   ├── Button.jsx       # Reusable button
│   │   │   ├── Modal.jsx        # Modal component
│   │   │   ├── Loading.jsx      # Loading spinner
│   │   │   ├── EmptyState.jsx   # Empty state component
│   │   │   └── ErrorMessage.jsx # Error display
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Dashboard page
│   │   │   ├── Employees.jsx    # Employee management
│   │   │   └── Attendance.jsx   # Attendance tracking
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hrms-lite
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your MongoDB connection string
# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/hrms_lite
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hrms_lite

# Start the server
npm start

# For development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional for local development)
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

#### 4. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Employee Endpoints

**Get All Employees**
```http
GET /api/employees
```

**Get Single Employee**
```http
GET /api/employees/:id
```

**Create Employee**
```http
POST /api/employees
Content-Type: application/json

{
  "employeeId": "EMP001",
  "fullName": "John Doe",
  "email": "john.doe@company.com",
  "department": "Engineering"
}
```

**Delete Employee**
```http
DELETE /api/employees/:id
```

#### Attendance Endpoints

**Get All Attendance Records**
```http
GET /api/attendance?date=2024-02-07&employeeId=EMP001
```

**Get Employee Attendance**
```http
GET /api/attendance/employee/:employeeId
```

**Mark Attendance**
```http
POST /api/attendance
Content-Type: application/json

{
  "employeeId": "EMP001",
  "date": "2024-02-07",
  "status": "Present"
}
```

**Delete Attendance Record**
```http
DELETE /api/attendance/:id
```

#### Dashboard Endpoints

**Get Dashboard Statistics**
```http
GET /api/dashboard/stats
```

### Response Format

**Success Response**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## 🌐 Deployment

### Backend Deployment (Render/Railway)

#### Using Render:

1. Create account on [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: hrms-lite-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variable:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: production
6. Click "Create Web Service"

#### Using Railway:

1. Create account on [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (same as Render)
5. Deploy

### Frontend Deployment (Vercel/Netlify)

#### Using Vercel:

1. Create account on [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
5. Add environment variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-api.onrender.com/api`)
6. Click "Deploy"

#### Using Netlify:

1. Create account on [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Configure:
   - **Base directory**: frontend
   - **Build command**: `npm run build`
   - **Publish directory**: frontend/dist
5. Add environment variable (same as Vercel)
6. Click "Deploy site"

## 🎯 Assumptions & Limitations

### Assumptions
1. **Single Admin User**: No authentication/authorization implemented as per requirements
2. **Basic HR Operations**: Focus on employee records and attendance only
3. **Date Format**: All dates stored in ISO 8601 format
4. **Department Input**: Free-text input for departments (no predefined list)
5. **Employee ID Format**: No specific format enforced, but must be unique

### Limitations
1. **No Authentication**: Application is open to anyone with the URL
2. **No User Roles**: Everyone has full admin access
3. **No Leave Management**: Only tracks present/absent status
4. **No Payroll**: Salary and payment features not included
5. **No File Uploads**: No support for profile pictures or documents
6. **No Email Notifications**: No automated emails for attendance or updates
7. **Basic Reporting**: Limited to dashboard statistics
8. **No Data Export**: Cannot export data to Excel/PDF
9. **No Audit Trail**: Changes are not logged with timestamps/user info
10. **Time Zone**: Uses server time zone for all dates

### Known Issues
- Attendance can be marked for future dates (no date validation)
- No bulk operations (e.g., mark attendance for all employees)
- No search functionality for large employee lists
- No pagination (may have performance issues with 1000+ records)

## 🔧 Future Enhancements

Potential features for future versions:
- User authentication and role-based access control
- Leave management system
- Payroll integration
- Performance reviews
- Employee self-service portal
- Bulk attendance marking
- Advanced reporting and analytics
- Data export (Excel, PDF)
- Email notifications
- Document management
- Mobile application
- Calendar view for attendance
- Biometric integration

## 👨‍💻 Development

### Code Quality
- Modular component structure
- Reusable UI components
- Clean separation of concerns
- Consistent naming conventions
- Error handling at all levels
- Input validation (client and server)

### Best Practices Followed
- RESTful API design
- Async/await for promises
- Environment variable configuration
- Proper HTTP status codes
- Mongoose schema validation
- React hooks for state management
- Responsive design principles

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 🤝 Contributing

This is a demo project for assessment purposes. However, suggestions and improvements are welcome!

## 📧 Contact

For any queries regarding this project, please reach out via the repository issues section.

---

**Built with ❤️ for the HRMS Lite Full-Stack Assignment**
