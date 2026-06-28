const express = require('express')
const app = express()
const connectDb =require('./src/Db/DB')

(async () => {
    await connectDb();

    app.listen(8000, () => {
        console.log("Server Started On Port 8000");
    })
})()