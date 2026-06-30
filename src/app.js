const express = require('express')
const app = express()
const auth = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const board = require('./routes/board.routes')
const task = require("./routes/task.routes")
const ai = require("./routes/ai.routes")
const cors = require('cors');


app.use(cors({
    origin: ['https://taskflow-frontend-brown-psi.vercel.app',
        'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.options(/.*/, cors());

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 Minute
    max: 50, // Max 50 requests
    message: "Too Many Requests From This IP, Please Try after A Minute",
})

app.use(express.json())
app.use(cookieParser());
app.use(limiter);


app.use('/api/auth', auth);
app.use("/api/boards", board)
app.use("/api/task", task);
app.use('/api/ai', ai);

module.exports = app;