 Kanban
 
A personal productivity hub built with the React + Redux + Node + MongoDB.

---

 Features

- 🔐 JWT Auth (Signup/Login)
- 🗂 Create, rename, delete boards
- ⭐ Favorite boards with emoji icons
- 🧩 Add, edit, delete sections dynamically
- 🔄 Drag & drop sections/tasks
- 📝 Editor for rich task descriptions
- 💻 Responsive UI for all screens
- 🎨 Font styling for task content

---

 Tech Stack

- Frontend: React, Redux Toolkit, React Router, Material-UI
- Backend: Node.js, Express.js, MongoDB (Mongoose)  
- Auth: JWT  
- Deploy: Render (client) ---> static site , Render (server) --> web services

---

 Usage
 
- Create boards → Add sections → Add tasks
- Drag to reorder tasks or sections
- Star boards to favorite them
- Edit content inline
- Works perfectly across all devices

---

 Getting started

```
🛠️ Installation

Download the zip file from https://github.com/anurudha07/Kanban
Open in VS code or any other relevant code editor

Proceed with following steps further...

# Setup .env file --->

----- server -----
MONGODB_URL=your_mongodb_uri
TOKEN_SECRET_KEY=your_jwt_secret
SESSION_SECRET=your_cookie_secret
PORT=your_port | 5000


----- client -----
REACT_APP_API_URL=http://localhost:5000/api/v1



🔗 Backend setup
cd backend
npm i
npm start


💻 Frontend setup
cd frontend
npm install --legacy-peer-deps
npm run build
npm start


Production ----------->


Setup the client on render or any other equivalent:

build command: npm install --legacy-peer-deps && npm run build
publish directory: build

env setup ---
VITE_API_URL=your_server_url_on_render

-----------------------------------------------------------

Setup the server on render or any other equivalent:

build command: npm i
run command: npm start

env setup ---
MONGODB_URL=your_mongodb_url
PASSWORD_SECRET_KEY=your_password_secret_key
TOKEN_SECRET_KEY=your_token_secret_key
PORT=your_port



Contact
Anurudha Sarkar
📧 anurudhs567@gmail.com
🔗 [Portfolio -](https://portfolio-kxhf.onrender.com/) 

🙌 Author
developed by 
-- Anurudha Sarkar --


