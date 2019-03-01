const mongoose = require('database');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name:  String,
});


module.exports = mongoose.model('users', UserSchema);
