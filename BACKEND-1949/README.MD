# Project Description

This is the backend of a full-stack barber shop appointment management system.
It provides authentication, role-based authorization, user management, and appointment scheduling using a REST API built with Node.js, Express, and MongoDB.

The backend supports two roles:

User: can manage their own profile and appointments

Admin: can manage all users and all appointments

Authentication is handled using JWT access tokens with refresh token support.

## Technologies Used:

-Node.js

-Express.js

-MongoDB

-Mongoose

-JSON Web Tokens (JWT)

-bcryptjs

-dotenv

-cors

### Project Structure
backend/
├─ src/
│  ├─ App.js
│  ├─ controllers/
│  │  └─ authController.js
│  ├─ models/
│  │  ├─ User.js
│  │  └─ Appointment.js
│  ├─ routes/
│  │  └─ authRoutes.js
│  ├─ middlewares/
│  │  ├─ authMiddleware.js
│  │  └─ adminMiddleware.js
│  └─ DataBase/
│     └─ db.js
├─ .env
├─ package.json
└─ README.md

Environment Variables

Create a .env file in the root of the backend project:

PORT=3000
MONGO_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/barber_db
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

Installation & Running
npm install
npm run dev


The server will run on:

http://localhost:3000

Authentication Flow

Users authenticate via /auth/login

Access token is returned (short-lived)

Refresh token is used automatically to renew access

Protected routes require a valid JWT

Role validation is enforced via middleware

API Endpoints
Auth
POST	/auth/register	Register a new user
POST	/auth/login	Login user
POST	/auth/refresh	Refresh access token

User (Authenticated)
GET	/me	Get own profile
PATCH	/me	Update own profile
DELETE	/users/:id	Delete own account

Admin — Users
GET	/users	Get all users
PATCH	/users/:id	Update any user
DELETE	/users/:id	Delete any user

Appointments
POST	/appointments	User	Create appointment
GET	/appointments/me	User	Get own appointments
GET	/appointments	Admin	Get all appointments
PATCH	/appointments/:id	User/Admin	Update or cancel appointment

### Roles Explanation
User

-Can register and login

-Can manage own profile

-Can create, view, edit, and cancel own appointments

-Cannot access admin routes

Admin

-Can view all users

-Can edit or delete any user

-Can view and cancel all appointments

-Cannot create appointments

Notes

-Passwords are hashed using bcrypt

-Sensitive fields are excluded from responses

-Role-based access is enforced both server-side and client-side
