# Quick Start Guide

## Prerequisites
- Node.js (v16+)
- MongoDB installed and running
- Angular CLI (v17+)

## Step 1: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS/Linux
mongod
```

## Step 2: Setup Backend

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example` if exists):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/school_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

4. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:3000`

## Step 3: Setup Frontend

1. Open a new terminal and navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend server:
```bash
ng serve
```

Frontend will run on `http://localhost:4200`

## Step 4: Create Admin User

1. Open Postman or use curl to register an admin:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@school.com",
    "password": "admin123",
    "role": "Admin"
  }'
```

2. Or use the registration endpoint through the API

## Step 5: Login

1. Open browser and go to `http://localhost:4200`
2. Login with the admin credentials you created
3. You'll be redirected to the admin dashboard

## Default Test Credentials

After creating the admin, you can:
- Create teachers and students through the admin panel
- Assign subjects and grades
- Login as teacher/student to test their respective features

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the MONGODB_URI in `.env` file
- Verify MongoDB is accessible on the specified port

### Port Already in Use
- Change PORT in backend `.env` file
- Update API URL in frontend services if backend port changes

### CORS Errors
- Backend CORS is configured for `http://localhost:4200`
- If using different port, update CORS settings in `backend/server.js`

### Angular Build Errors
- Ensure all dependencies are installed: `npm install`
- Check Node.js version compatibility
- Clear node_modules and reinstall if needed

## Next Steps

1. Create subjects through Admin panel
2. Create grades and assign teachers/students
3. Login as teacher to assign marks
4. Login as student to view grades

Enjoy using the School Management System!
