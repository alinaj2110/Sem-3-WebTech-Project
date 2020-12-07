var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
_id: mongoose.Schema.Types.ObjectId,
name: String,
email: String,
username: String,
password: String,
mobile_no: String
});



module.exports =mongoose.model('User', UserSchema, 'users');