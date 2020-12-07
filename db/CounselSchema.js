var mongoose = require('mongoose');

var CounselSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    address: String,
    mobile_no: String,
    speciality: String
});

module.exports =mongoose.model('Counsellor', CounselSchema, 'counsellors');