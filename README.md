# BiteCraft - Smart Recipe Planner & Pantry Manager

 **Live Demo:** https://bitecraft-dgxl.onrender.com

## Overview

BiteCraft is a full-stack recipe management and meal planning application that helps users discover recipes, manage pantry ingredients, and create personalized weekly meal plans.

The main goal of this project was to understand how real-world full-stack applications are designed, developed, and deployed. While building BiteCraft, I learned how frontend and backend systems communicate, how authentication works, how databases store user-specific data, how to integrate external APIs, and how applications are prepared for production deployment.

This project helped me gain practical experience in full-stack development, backend architecture, database management, API integration, containerization, and cloud deployment.

---

## Screenshots

### Home Page
<img width="500px" height="500px" alt="image" src="https://github.com/user-attachments/assets/c8661c93-5b00-4df4-843c-db9502316720" />


### Recipe Search
<img width="500px" height="500px" alt="image" src="https://github.com/user-attachments/assets/7ab083d7-a9f9-4e40-a978-8d027c998a13" />


### Pantry Tracker
<img width="500px" height="500px" alt="image" src="https://github.com/user-attachments/assets/7568bb31-7416-4dfa-917b-fd79b72f0aba" />

### Meal Plannar
<img width="500px" height="500px" alt="image" src="https://github.com/user-attachments/assets/f2a2a33e-1ce8-410c-a3cd-3b2c14a969e0" />

---

# Features

## Authentication & User Management

- User registration and login system
- Secure password handling
- Session-based authentication
- Persistent user login using database-backed sessions
- User-specific data management

---

## Pantry Management

- Users can add and manage available ingredients
- Pantry items are stored in PostgreSQL database
- Personalized recipe searching based on available ingredients

---

## Recipe Search & Details

- Integrated **Spoonacular API** for recipe data
- Search recipes using ingredients or keywords
- Fetch detailed recipe information
- Display recipe images, instructions, and cooking details
- Handle external API requests and responses efficiently

---

## Weekly Meal Planner

- Create personalized weekly meal plans
- Add breakfast, lunch, and dinner schedules
- Store meal plans according to individual users
- Retrieve and display saved meal plans

---

## Responsive User Interface

- Designed responsive layouts for different screen sizes
- Improved UI/UX using CSS
- Learned modern styling techniques
- Optimized pages for desktop and mobile devices

---

# Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- EJS Templates

## Backend

- Node.js
- Express.js
- REST APIs

## Database

- PostgreSQL
- Neon PostgreSQL (Cloud Database)

## Authentication

- Express Session
- PostgreSQL-based session storage

## External API

- Spoonacular API

## Deployment

- Docker
- Render
- Neon Database

---

# Project Structure

```
BiteCraft/
│
├── public/
│   ├── css/
│   │   ├── responsive.css
│   │   └── style.css
│   │
│   ├── images/
│   │   ├── favicon.ico
│   │   ├── recipe.png
│   │   ├── bars-solid-full.svg
│   │   └── xmark-solid-full.svg
│   │
│   └── js/
│       └── main.js
│
├── views/
│   ├── partials/
│   │   ├── footer.ejs
│   │   └── header.ejs
│   │
│   ├── 404.ejs
│   ├── 500.ejs
│   ├── home.ejs
│   ├── info.ejs
│   ├── login.ejs
│   ├── pantry.ejs
│   ├── plannar.ejs
│   ├── recipes.ejs
│   ├── register.ejs
│   ├── search-recipe.ejs
│   └── search.ejs
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── index.js
├── package.json
├── package-lock.json
└── README.md
```
       
---

# Docker Containerization

BiteCraft was containerized using Docker to create a consistent production environment.

Using Docker helped me understand:

- How applications are packaged
- How dependencies are managed
- How to create reproducible environments
- How applications can run consistently across different systems
- Basic production deployment workflows

---

# Deployment

The application is deployed using:

### Backend + Frontend Hosting
- Render

### Database Hosting
- Neon PostgreSQL

The deployment process helped me understand:

- Environment variables management
- Production configuration
- Cloud deployment workflow
- Connecting hosted applications with cloud databases

---

# Learning Outcomes

Building BiteCraft helped me understand practical concepts used in real-world software development.

## Full Stack Development

Learned:

- How frontend and backend communicate
- Creating backend routes and handling requests
- Managing application flow between client and server
- Structuring a full-stack application

---

## Backend Development

Learned:

- Building RESTful routes using Express.js
- Handling user requests and responses
- Connecting backend applications with databases
- Managing application logic

---

## Authentication & Sessions

Learned:

- How authentication systems work
- User login and registration flow
- Session-based authentication
- How websites remember logged-in users
- Storing sessions securely in databases

---

## Database Management

Learned:

- Designing relational database tables
- Writing SQL queries
- Connecting PostgreSQL with Node.js
- Managing user-specific information
- Using cloud databases

---

## Working With External APIs

Learned:

- Integrating third-party APIs
- Sending API requests
- Processing API responses
- Handling API errors
- Using external services inside applications

---

## Frontend Development

Learned:

- Creating responsive designs
- Improving UI/UX
- Writing cleaner CSS
- Making layouts work across devices
- Understanding frontend-backend interaction

---

## Deployment

Learned:

- Deploying full-stack applications
- Using Docker for containerization
- Managing production environment variables
- Hosting applications on cloud platforms

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/Chandan-24A/BiteCraft.git
```

## Navigate to Project

```bash
cd BiteCraft
```

## Install Dependencies

```bash
npm install
```

## Create Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_neon_database_url

SESSION_SECRET=your_session_secret

SPOONACULAR_API_KEY=your_spoonacular_api_key
```

 Never commit your `.env` file to GitHub.

---

#  Run Application

## Development Mode

```bash
npm run dev
```

## Production Mode

```bash
npm start
```

Application runs on:

```
http://localhost:3000
```

---

# Running With Docker

## Build Docker Image

```bash
docker build -t bitecraft .
```

## Run Container

```bash
docker run -p 3000:3000 bitecraft
```

Application will be available at:

```
http://localhost:3000
```

---

 If you find this project useful, consider giving it a star!
