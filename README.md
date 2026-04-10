# Full Stack Rating Platform

A role-based store rating platform built for the FullStack Intern Coding Challenge.

## Tech Stack

- Backend: NestJS
- Database: PostgreSQL
- Frontend: React + TypeScript
- Authentication: JWT
- ORM: TypeORM

## Features

### System Administrator

- View dashboard statistics for total users, stores, and ratings
- Create admin users, normal users, and store owners
- Create stores and assign them to store owners
- Filter and sort users by name, email, address, role, and created date
- Filter and sort stores by name, email, address, rating, and created date
- Open full user detail pages

### Normal User

- Register and log in
- Change password after logging in
- Search stores by name and address
- Sort store listings
- Submit and update store ratings from 1 to 5
- View and sort personal rating history

### Store Owner

- Log in and change password
- View assigned stores
- View average rating and total ratings per store
- View and sort the list of users who rated each store

## Validation Rules

- Name: 20 to 60 characters
- Address: maximum 400 characters
- Password: 8 to 16 characters, at least one uppercase letter, at least one special character
- Email: standard email validation

## API Access Points

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`
- API docs: `http://localhost:3001/api`
- Backend root health/info endpoint: `http://localhost:3001/`

## Main Backend Routes

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/change-password`
- `GET /auth/profile`
- `GET /users`
- `POST /users`
- `GET /users/:id`
- `DELETE /users/:id`
- `GET /users/dashboard/stats`
- `GET /stores`
- `POST /stores`
- `GET /stores/:id`
- `GET /stores/my-stores`
- `DELETE /stores/:id`
- `POST /ratings/stores/:storeId`
- `PUT /ratings/stores/:storeId`
- `GET /ratings/stores/:storeId`
- `GET /ratings/stores/:storeId/stats`
- `GET /ratings/my-ratings`
- `GET /ratings/my-ratings/stores/:storeId`
- `DELETE /ratings/stores/:storeId`

## Local Setup

### 1. Create the database

```sql
CREATE DATABASE rating_platform;
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=rating_platform
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=3001
```

Start the backend:

```bash
npm run start:dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` with:

```env
REACT_APP_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm start
```

## Recommended Demo Flow

1. Register or create an admin user.
2. Log in as admin.
3. Create one or more store owners.
4. Create stores and assign them to those store owners.
5. Register a normal user.
6. Log in as the normal user and submit ratings.
7. Log in as a store owner and review the ratings.

## Verification

Verified in this workspace:

- Backend build: `npm.cmd run build` from `backend/`
- Frontend type check: `npx.cmd tsc --noEmit` from `frontend/`


## Notes

- The backend uses `synchronize: true` in TypeORM, which is suitable for local development only.
- Store creation requires selecting an existing store owner.

## How to Run?

Run the backend:
cd "C:\Users\Your_user_name\OneDrive\Desktop\Full_Stack_Coding\backend"
npm.cmd run start:dev

Then Run the frontend in another terminal:
cd "C:\Users\Your_user_name\OneDrive\Desktop\Full_Stack_Coding\frontend"
npm.cmd start


## Outputs

#Database:
<img width="1918" height="1032" alt="image" src="https://github.com/user-attachments/assets/1c3527ed-563a-4327-beda-d80bb1a9293c" />

#Home Page
<img width="1685" height="896" alt="image" src="https://github.com/user-attachments/assets/41c1b1ae-d4c4-4f25-8a67-264daea70c6a" />

#System Administrator
<img width="1612" height="922" alt="image" src="https://github.com/user-attachments/assets/348a7e89-bcbd-4c08-9f59-da3604b58623" />
<img width="1637" height="902" alt="image" src="https://github.com/user-attachments/assets/c0d02c21-707c-42b6-9726-55e4e4b997bd" />
<img width="1598" height="892" alt="image" src="https://github.com/user-attachments/assets/424cb75a-ae3d-4ede-be07-9d6f90bec9c3" />
<img width="1620" height="927" alt="image" src="https://github.com/user-attachments/assets/a1db16cf-362d-4f16-865e-4a92d2fead6d" />
<img width="1572" height="888" alt="image" src="https://github.com/user-attachments/assets/11b6833b-6c4b-42e9-8a57-c8bcd826118b" />



