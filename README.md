# School Management System - MEAN Stack

A comprehensive school management system built with MongoDB, Express.js, Angular, and Node.js, featuring role-based access control (RBAC) for Admin, Teacher, and Student roles.

## Features

### Admin Features
- ✅ Add & manage teachers
- ✅ Add & manage students
- ✅ Add & manage subjects
- ✅ Add & manage grades
- ✅ Assign teachers and students to grades

### Teacher Features
- ✅ Assign marks to students for various subjects
- ✅ View assigned students & their grades
- ✅ Manage marks (create, update, delete)

### Student Features
- ✅ View their grades & marks
- ✅ Only see marks related to enrolled subjects
- ✅ View subject-wise performance

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **Angular 17** - Frontend framework
- **Angular Material** - UI component library
- **RxJS** - Reactive programming
- **TypeScript** - Type-safe JavaScript

## Project Structure

```
SchoolManagementSystem/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & RBAC middleware
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/
│   │   │   │   ├── admin/      # Admin module
│   │   │   │   ├── teacher/    # Teacher module
│   │   │   │   └── student/    # Student module
│   │   │   ├── services/       # API services
│   │   │   ├── guards/         # Route guards
│   │   │   └── interceptors/   # HTTP interceptors
│   │   └── ...
│   └── ...
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Angular CLI (v17 or higher)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

4. Start MongoDB (if not running):
```bash

net start MongoDB


mongod
```

5. Start the backend server:
```bash
npm run dev
# or
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve

npm start
```

The frontend will run on `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Admin Routes (Requires Admin role)
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/subjects` - Get all subjects
- `POST /api/admin/subjects` - Create subject
- `PUT /api/admin/subjects/:id` - Update subject
- `DELETE /api/admin/subjects/:id` - Delete subject
- `GET /api/admin/grades` - Get all grades
- `POST /api/admin/grades` - Create grade
- `PUT /api/admin/grades/:id` - Update grade
- `POST /api/admin/grades/:id/assign` - Assign teachers/students to grade
- `GET /api/admin/stats` - Get dashboard statistics

### Teacher Routes (Requires Teacher role)
- `GET /api/teacher/students` - Get assigned students
- `GET /api/teacher/students/:id` - Get student details
- `GET /api/teacher/marks` - Get all marks
- `POST /api/teacher/marks` - Create mark
- `PUT /api/teacher/marks/:id` - Update mark
- `DELETE /api/teacher/marks/:id` - Delete mark

### Student Routes (Requires Student role)
- `GET /api/student/grades` - Get student grades
- `GET /api/student/grades/:subjectId` - Get subject grades
- `GET /api/student/profile` - Get student profile

## Default Users

You can create users through the registration endpoint or directly in MongoDB. To create an admin user, use:

```bash
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@gmial.com",
  "password": "123456",
  "role": "Admin"
}
```

## Role-Based Access Control

The system implements RBAC with three roles:

1. **Admin**: Full access to all features
2. **Teacher**: Can manage students and assign marks
3. **Student**: Can only view their own grades

Access is controlled through:
- Backend middleware (`middleware/auth.js`)
- Frontend guards (`guards/auth.guard.ts`, `guards/role.guard.ts`)

## Database Schema

### User
- name, email, password, role
- subjects (array of Subject IDs)
- assignedStudents (array of User IDs) - for teachers
- assignedTeachers (array of User IDs) - for students
- grade (Grade ID) - for students

### Subject
- name, description

### Grade
- name, description
- teachers (array of User IDs)
- students (array of User IDs)

### Mark
- student (User ID)
- subject (Subject ID)
- teacher (User ID)
- marks (number 0-100)
- examType (Quiz, Midterm, Final, Assignment)
- remarks

## Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev  
```

Frontend:
```bash
cd frontend
ng serve  
```

### Building for Production

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
ng build --configuration production
```

## Testing

The application includes:
- Form validation on both frontend and backend
- Error handling with user-friendly messages
- Role-based route protection
- Input sanitization and validation

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Protected API routes

## License

This project is created for educational purposes.

## Support

For issues or questions, please check the code documentation or create an issue in the repository.
