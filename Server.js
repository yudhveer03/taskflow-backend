require('dotenv').config()
const app = require('./src/app')


const connectDb = require('./src/Db/DB')



connectDb(); 

app.listen('8000', (req, res) => {
    console.log('Server Started on Port 8000')
    
})