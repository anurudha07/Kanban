# Kanban

A personal productivity hub built with the MERN stack + Redux.

## Features

- 🔐 JWT Auth (Signup/Login)
- 🗂 Create, rename, delete boards
- ⭐ Favorite boards with emoji icons
- 🧩 Add, edit, delete sections dynamically
- 🔄 Drag & drop sections/tasks
- 📝 CKEditor for rich task descriptions
- 💻 Responsive UI for all screens
- 🎨 Font styling for task content

## Tech Stack

- **Frontend**: React, Redux Toolkit, React Router, Material-UI, React Beautiful DnD, CKEditor  
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)  
- **Auth**: JWT  
- **Deploy**: Vercel (client), Render (server)

## Setup

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install && npm run build
Environment
server/.env

ini
Copy
Edit
MONGODB_URL=your_mongodb_uri
TOKEN_SECRET_KEY=your_jwt_secret
SESSION_SECRET=your_cookie_secret
PORT=5000
client/.env.development

bash
Copy
Edit
REACT_APP_API_URL=http://localhost:5000/api/v1
Run
bash
Copy
Edit
# Server
cd server
npm start

# Client
cd client
npm start
Visit http://localhost:3000

Usage
Create boards → Add sections → Add tasks

Drag to reorder tasks or sections

Star boards to favorite them

Edit content inline

Works perfectly on mobile/tablet

License
MIT

Contact
Anurudha Sarkar
📧 anurudhs567@gmail.com
🔗 LinkedIn

vbnet
Copy
Edit

Let me know if you'd like a version with installation screenshots, links to demo, or a `demo.gif`.
