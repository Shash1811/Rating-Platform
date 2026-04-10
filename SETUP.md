# Full Stack Rating Platform - Setup Guide

## Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm or yarn

## Database Setup

1. **Create PostgreSQL Database**
   ```sql
   CREATE DATABASE rating_platform;
   ```

2. **Update Database Configuration**
   Edit `backend/.env` file with your PostgreSQL credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_postgres_username
   DB_PASSWORD=your_postgres_password
   DB_NAME=rating_platform
   ```

## Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run start:dev
   ```

   The backend will be available at `http://localhost:3001`

4. **API Documentation**
   Visit `http://localhost:3001/api` for Swagger documentation

## Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Default Users

After starting the backend, you can create users through the registration endpoint or directly in the database. Here are the user roles:

1. **System Administrator** - Can manage users and stores
2. **Normal User** - Can browse stores and submit ratings
3. **Store Owner** - Can view their store ratings

## Testing the Application

### 1. Create an Admin User
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "System Administrator User With Long Name",
    "email": "admin@example.com",
    "password": "Admin123!",
    "address": "123 Admin Street, City, State"
  }'
```

### 2. Login as Admin
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

### 3. Create a Store Owner User (via Admin Panel)
1. Login to the frontend as admin
2. Navigate to `/admin/users`
3. Create a new user with role "Store Owner"

### 4. Create a Normal User
1. Navigate to `/register` in the frontend
2. Fill out the registration form

### 5. Create Stores
1. As admin, navigate to `/admin/stores`
2. Create new stores and assign them to store owners

### 6. Test Rating System
1. Login as a normal user
2. Navigate to `/stores`
3. Browse and rate stores

## Features Implemented

### System Administrator
- ✅ Dashboard with total users, stores, and ratings
- ✅ Add new users with roles
- ✅ View and filter users list
- ✅ View and filter stores list
- ✅ Delete users and stores

### Normal User
- ✅ Registration and login
- ✅ Browse stores with search functionality
- ✅ Submit ratings (1-5 stars)
- ✅ Modify existing ratings
- ✅ View submitted ratings
- ✅ Password change functionality

### Store Owner
- ✅ View their stores
- ✅ See average ratings
- ✅ View users who rated their stores
- ✅ Password change functionality

### Form Validations
- ✅ Name: 20-60 characters
- ✅ Address: Max 400 characters
- ✅ Password: 8-16 characters, 1 uppercase, 1 special character
- ✅ Email: Standard email validation

## Database Schema

### Users Table
- id (Primary Key)
- name (VARCHAR 60)
- email (Unique)
- password (Hashed)
- address (VARCHAR 400)
- role (ENUM: admin, normal_user, store_owner)
- created_at, updated_at

### Stores Table
- id (Primary Key)
- name (VARCHAR 100)
- email (Unique)
- address (VARCHAR 400)
- owner_id (Foreign Key to Users)
- created_at, updated_at

### Ratings Table
- id (Primary Key)
- rating (INTEGER 1-5)
- user_id (Foreign Key to Users)
- store_id (Foreign Key to Stores)
- created_at, updated_at
- Unique constraint on (user_id, store_id)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration

## Technologies Used

### Backend
- NestJS (Node.js framework)
- TypeScript
- PostgreSQL with TypeORM
- JWT authentication
- bcrypt for password hashing
- Swagger for API documentation

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Context API for state management

## Production Deployment Notes

1. **Database**: Use environment variables for database credentials
2. **JWT Secret**: Use a strong, unique secret in production
3. **CORS**: Configure CORS for your production domain
4. **Build**: Run `npm run build` for production builds
5. **Database Sync**: Disable `synchronize: true` in production and use migrations
