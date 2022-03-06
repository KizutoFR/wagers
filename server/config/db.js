const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async (uri, callback) => {
    try {
        await mongoose.connect(process.env.DB_CREDENTIALS, {useNewUrlParser: true});
        console.log("MongoDB is connected...");
    } catch(err) {
        console.error(err);
    }
}

module.exports = connectDB;