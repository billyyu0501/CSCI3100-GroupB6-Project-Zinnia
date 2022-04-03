const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());

//connecting to Mongoose
const uri = process.env.ATLAS_URI;
mongoose.connect(uri,{useNewUrlParser:true, useUnifiedTopology: true});

const connection = mongoose.connection;
//connection failure
connection.on('error', console.error.bind(console,'Connection error'));
//Connect Successfully
connection.once('open',()=>{
    console.log("MongoDB database connection established successfully");
})


//import routes
const register = require('./routes/register')
const post = require("./routes/post")
const login = require("./routes/login")
const search = require("./routes/search")
const profile = require("./routes/profile")
const verify = require("./routes/verify")
const forgotpw = require("./routes/forgotpw")
const chat = require("./routes/chat")
const groupchat = require("./routes/groupchat")
const admin = require("./routes/admin")

app.use(register)
app.use(post)
app.use(login)
app.use(search)
app.use(profile)
app.use(verify)
app.use(forgotpw)
app.use(chat)
app.use(groupchat)
app.use(admin)


app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
})