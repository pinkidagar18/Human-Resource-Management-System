# Quick Start Guide - HRMS Lite

Get the application running locally in under 5 minutes!

## Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (or use MongoDB Atlas)

## Step-by-Step Setup

### 1. Clone & Navigate

```bash
git clone <your-repo-url>
cd hrms-lite
```

### 2. Backend Setup

```bash
# Go to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file and set MongoDB URI
# For local MongoDB: MONGODB_URI=mongodb://localhost:27017/hrms_lite
# For MongoDB Atlas: Use your connection string
```

**Start the backend server:**
```bash
npm start
```

✅ Backend should be running on `http://localhost:5000`

### 3. Frontend Setup (New Terminal)

```bash
# Open a new terminal and go to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

✅ Frontend should be running on `http://localhost:3000`

### 4. Open the Application

Open your browser and go to: **http://localhost:3000**

## First Steps in the Application

### Add Your First Employee
1. Click on "Employees" in the navigation
2. Click "Add Employee" button
3. Fill in the form:
   - Employee ID: `EMP001`
   - Full Name: `John Doe`
   - Email: `john.doe@company.com`
   - Department: `Engineering`
4. Click "Add Employee"

### Mark Attendance
1. Click on "Attendance" in the navigation
2. Click "Mark Attendance" button
3. Select the employee you just created
4. Choose today's date
5. Select "Present" or "Absent"
6. Click "Mark Attendance"

### View Dashboard
1. Click on "Dashboard" in the navigation
2. See the overview of your system:
   - Total employees
   - Today's attendance summary
   - Department distribution

## Troubleshooting

### Backend won't start?
- ✅ Check MongoDB is running (local) or connection string is correct (Atlas)
- ✅ Verify port 5000 is not in use: `lsof -i :5000`
- ✅ Check `.env` file exists and has correct values

### Frontend won't start?
- ✅ Make sure backend is running first
- ✅ Verify port 3000 is not in use: `lsof -i :3000`
- ✅ Try deleting `node_modules` and reinstalling

### Can't connect to database?
- ✅ MongoDB service is running: `brew services list` (Mac) or `systemctl status mongod` (Linux)
- ✅ Connection string is correct in `.env`
- ✅ For Atlas: Check IP whitelist includes your IP

### CORS errors in browser?
- ✅ Backend is running
- ✅ Check browser console for specific error
- ✅ Verify API URL in frontend matches backend URL

## Useful Commands

### Backend
```bash
npm start          # Start server
npm run dev        # Start with auto-reload (requires nodemon)
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## API Testing

You can test the API using curl or Postman:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all employees
curl http://localhost:5000/api/employees

# Create employee
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP002",
    "fullName": "Jane Smith",
    "email": "jane.smith@company.com",
    "department": "Marketing"
  }'
```

## What's Next?

- 📖 Read the full [README.md](./README.md) for detailed information
- 🚀 Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- 🧪 Explore all features of the application
- 💡 Consider adding more employees and testing filters

## Need Help?

- Check the main README.md for comprehensive documentation
- Review API documentation in README.md
- Check deployment guide if you're deploying
- Look at the code comments for implementation details

---

**Happy coding! 🚀**
