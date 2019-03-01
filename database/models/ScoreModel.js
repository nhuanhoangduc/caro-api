const mongoose = require('database');
const Schema = mongoose.Schema;


const ScoreSchema = new Schema({
    firstUserId: String,
    firstUserScore: Number,

    secondUserId: String,
    secondUserScore: Number,
});


module.exports = mongoose.model('scores', ScoreSchema);
