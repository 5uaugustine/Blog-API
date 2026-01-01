# Blog API – Backend Project

This is a RESTful Blog API built using Node.js, Express, and MySQL.
It supports user authentication, secure CRUD operations, and JWT-based authorization.

##  Features
- User Registration & Login
- Password Hashing using bcrypt
- JWT Authentication
- Create, Read, Update, Delete Blog Posts
- Only post authors can update or delete their posts
- MySQL Database Integration

##  Tech Stack
- Node.js
- Express.js
- MySQL
- JSON Web Token (JWT)
- bcryptjs
- dotenv

## Project Structure
blog-api/
├── config/
│ └── db.js
├── middleware/
│ └── authMiddleware.js
├── routes/
│ ├── auth.js
│ └── posts.js
├── server.js
├── .env
├── package.json

##  How to Run the Project

### Install dependencies
in ```bash
npm install

## Start the server
npm start
The server will run on:
http://localhost:5000

## API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login
Blog Posts
POST /api/posts (Protected)
GET /api/posts
PUT /api/posts/:id (Protected – Owner only)
DELETE /api/posts/:id (Protected – Owner only)

## Author
Anju Augustine
