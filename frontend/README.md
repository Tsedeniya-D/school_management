<<<<<<< HEAD
# Frontend - School Management System

Angular 17 frontend with Angular Material for the School Management System.
=======
<<<<<<< HEAD
# school_management
=======
# Backend - School Management System

Express.js backend with MongoDB for the School Management System.
>>>>>>> 99f52285690f7ebe07712c04ebe9260449fee166

## Setup

1. Install dependencies:
```bash
npm install
```

<<<<<<< HEAD
2. Start development server:
```bash
ng serve
# or
npm start
```

The app will be available at `http://localhost:4200`

## Build

```bash
ng build --configuration production
```

## Project Structure

- `src/app/modules/admin/` - Admin module
- `src/app/modules/teacher/` - Teacher module
- `src/app/modules/student/` - Student module
- `src/app/services/` - API services
- `src/app/guards/` - Route guards
- `src/app/interceptors/` - HTTP interceptors
=======
2. Create `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/school_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

3. Start MongoDB

4. Run the server:
```bash
npm run dev  # Development mode with nodemon
# or
npm start    # Production mode
```

## API Documentation

See main README.md for complete API endpoint documentation.
>>>>>>> 09eb29d (setup the back end)
>>>>>>> 99f52285690f7ebe07712c04ebe9260449fee166
