// This js hold all common function that are used in different backend js

let User = require("./models/user.model");
// Converting UserId to corresponding ObjectId
var getUserObjectId = async(userId)=>{
    var writerId = ""
    try{
        const response = await User.findOne({userId:userId});
        if (response !=null){writerId = response._id}
    }catch(err){
        console.log(err)
    }
    return writerId;
}

module.exports = getUserObjectId