# CSCI3100-GroupB6-Project-Zinnia

## Ways to run different code 
Please type the following commands in your terminal to run corresponding code.

npm install bcrypt --save
npm install crypto --save
npm install nodemailer --save
npm i passport passport-local express-session express-flash

Node.js (backend) http://localhost:8080
1. cd backend
2. node server

Client web (frontend)
1. cd zinnia
2. npm start 
* if you cannot run the code, please try to run npm install react-scripts in your terminal 

## Frontend
Code Position： zinnia/src

Useful Files/Folder:
1. Admin
    - AdminHome.js: holding the admin home page
    - PostManage.js: managing Post
    - UserManage.js: managing User
2. Login
    - ForgetPw.js
    - LoginPage.js
    - Registratopn.js
3. User
    - Chat
    - Forum
    - Profile
    - SearchUser
    - Home.js
4. App.js: holding the whole App
5. index.js: Render the react app and is linked to the html file

## Backend 
Code Position: zinnia/backend

Useful Files/Folder:
1. models
    - constructing the basic models/structure of the database
    - user.model.js: user database
    - post.model.js: post database
    - chatroom.model.js: chatroom database
2. routes
    - includes operations for different databases, such as CRUD operation 
3. server.js
    - connected to and hold all backend js file. It is the core file of backend 
4. .env
    - saved the environmental setting, including the url link for connecting Mongodb Altas
