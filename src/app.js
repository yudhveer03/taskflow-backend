const express = require('express')
const app = express()
const auth = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')  // Rate limiter
const board = require('./routes/board.routes')
const task = require("./routes/task.routes")
const ai = require("./routes/ai.routes")
const cors = require('cors'); 

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000 ,//1 Minute me
    max: 50,     // Max 50 request 
    message: "Too Many Request From This IP,Please Try after A Minute",
})

app.use(cors({
    origin: 'https://taskflow-frontend-brown-psi.vercel.app', // Wildcard '*' nahi hona chahiye, exact origin dalein
    credentials: true,                // Yeh cookies allow karega
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use(cookieParser());
app.use(limiter);

app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use('/api/auth', auth);
app.use("/api/boards",board)
app.use("/api/task", task);
app.use('/api/ai', ai);

module.exports = app;