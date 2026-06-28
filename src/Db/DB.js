const mongoose = require('mongoose')


const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Mongodb connected successfully")
        
    } catch (e) {
        console.error("MongoDb error", e.message);
    }
}

module.exports = connectDb;


