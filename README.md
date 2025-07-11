# Kanban | Your Personal Productivity Hub
Kanban is build using Redux & MERN stack 

# Description
This Kanban Board App provides a flexible, mobile‑responsive interface for organizing workflows. Create boards, add dynamic sections, and drag‑and‑drop task cards to reflect your process. With real‑time updates, emoji icons, and favorites, it’s your personal productivity hub—anywhere, anytime.

# Features
User Authentication
Secure signup & login using JSON Web Tokens (JWT).

## Board Management
• Create, rename, and delete boards
• Favorite boards for quick access
• Emoji icons for visual customization

## Section Management
• Add, edit, and delete sections dynamically
• Reorder sections via drag‑and‑drop

## Task Management
• Add, edit, and delete tasks within sections
• Drag‑and‑drop tasks between sections & reorder
• Rich text content for task descriptions (CKEditor)

## Responsive UI
• Permanent sidebar on desktop; hamburger menu on mobile
• Horizontal scroll for Kanban columns on tablets/desktop
• Vertical stacking of columns on small screens
• Shrinking spinner, slim scrollbars, and compact modals for mobile

## Favorites & Fints
• Mark boards as favorites
• Apply Fonts and styles to your task contemts


# Tech Stack
Frontend
React.js, Redux Toolkit, React Router, Material‑UI, React Beautiful DnD, CKEditor

Backend
Node.js, Express.js, Mongoose (MongoDB ODM)

Authentication
JWT (via jsonwebtoken), cookie‑session

Deployment
Render (or Heroku) for server; Vercel (or Netlify) for client

Installation
Clone the repo

# Backend
cd server 
npm install 

# Frontend
cd ../client 
npm install && npm run build 

# Configure environment variables

In server/.env:

MONGODB_URL=your_mongodb_connection_string
TOKEN_SECRET_KEY=your_jwt_secret
SESSION_SECRET=your_cookie_secret
PORT=5000


In client/.env.development:

REACT_APP_API_URL=http://localhost:5000/api/v1


# Start backend
cd server
npm start

# Start frontend
cd client
npm start

Open
Visit http://localhost:3000 in your browser.

# Usage
Sign up or log in.

Create your first board with the “Add Board” button.

Inside a board, click “Add Section” to create columns.

Use the “+” button to add tasks to any section.

Drag‑and‑drop sections or tasks to reorder or move them.

Click the star icon to favorite a board; access favorites from the sidebar.

Edit titles, descriptions, and emojis inline.

Delete boards, sections, or tasks with the delete icon.

# Contributing
Contributions are welcome! Please open an issue or submit a pull request for bug fixes, feature requests, or improvements.

# License
This project is licensed under the MIT License.

# Contact
Anurudha Sarkar
📧 anurudhs567@gmail.com
🔗 GitHub Repository
