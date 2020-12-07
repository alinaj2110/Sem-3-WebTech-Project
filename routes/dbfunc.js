// all database related functions
const mongoose =require('mongoose')
const Usermodel = require('../db/Userschema')
const Counselmodel = require('../db/CounselSchema')
mongoose.connect("mongodb://localhost:27017/Userdatabase", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

module.exports.databaseinsert = function (uname,pwd,nm,email,phone){

    const user= new Usermodel({
        _id: new mongoose.Types.ObjectId(),
        username: uname,
        password:pwd,
        name:nm,
        email:email,
        mobile_no:phone
    });
    user.save((err,result)=>{
        if(err)
            console.log(err);
    });
};

module.exports.databasefindbyusername = async function (uname){ 
    var obj= await Usermodel.findOne({username: uname}).lean().then(res=>{
        return JSON.parse(JSON.stringify(res));
    })
    if(obj== null)
        return null;
    else
        return obj;
};

module.exports.databasefindbyid = async function (userid){
    var obj=await Usermodel.findById({_id: userid}).lean().then(res=>{
        return JSON.parse(JSON.stringify(res));
    })
    if(obj== null)
        return null;
    else
        return obj;
};

module.exports.databasefindallcounsel = async function (){ 
    var obj= await Counselmodel.find({})
    .then(data=>{
        return JSON.parse(JSON.stringify(data));
    })
    if(obj== null)
        return null;
    else
        return obj.data;
};