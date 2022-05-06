// This file holds some common functions that are used in different backend js

let User = require("./models/user.model");

// Converting UserId to corresponding ObjectId
var getUserObjectId = async(userId)=>{
    var writerId = ""
    try{
        const response = await User.findOne({userId:userId});
        // console.log(response);
        if (response !=null){writerId = response._id}
    }catch(err){
        console.log(err)
    }
    return writerId;
}

// Convert userId to corresponding Username
var getUsername = async (userId) => {
    var username = "";
    try{
        const response = await User.findOne({userId:userId});
        if (response != null) 
            {username = response.username}
    } catch(err) {
        console.log(err);
    }
    return username;
}

module.exports.getUserObjectId = getUserObjectId;
module.exports.getUsername = getUsername;