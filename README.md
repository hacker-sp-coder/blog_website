# Full-Stack Modern Blog Platform

A full-stack, responsive blogging and social media platform built using the MERN stack (MongoDB, Express, React, Node.js). Features user authentication with JWT access/refresh tokens, paginated feeds, image uploads via Cloudinary, single-reaction likes/dislikes, comment threads, and view counters.

---

##  Tech Stack

### **Backend (`/blog_backend`)**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas with Mongoose ORM
* **Authentication:** JWT (Access Tokens in Headers, HTTP-Only Refresh Cookies), Bcrypt
* **File Handling:** Multer & Cloudinary SDK
* **Logging/Tooling:** Morgan, Nodemon

### **Frontend (`/blog_frontend`)**
* **Library:** React (Vite)
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM
* **HTTP Client:** Axios (with interceptors)
* **Icons:** Lucide React

Before running the project, ensure you have:

Node.js (v18 or higher) installed on your machine

A MongoDB Atlas cluster set up with network access enabled (0.0.0.0/0)

A Cloudinary free account for handling blog images

1. Clone the Repository
Bash
git clone [https://github.com/your-username/blog_website.git](https://github.com/your-username/blog_website.git)
cd blog_website

2. Backend Setup
Bash
# Navigate to backend folder
cd blog_backend

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env

Open .env and fill in your actual credentials (MONGO_URI, JWT_SECRET, and CLOUDINARY_* keys).

Note: Ensure the folder public/temp exists inside blog_backend so Multer can process temporary file uploads.


3. Frontend Setup
Open a second terminal window:

Bash
# Navigate to frontend folder
cd blog_frontend

# Install dependencies
npm install

Running the Application
Start the Backend Server
Inside blog_backend/:

Bash
npm run dev

Start the Frontend Client
Inside blog_frontend/:

Bash
npm run dev


Developed by Sachin Prajapati.