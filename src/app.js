const express = require('express')
const app = express()
const auth = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')  // Rate limiter
const board = require('./routes/board.routes')
const task = require("./routes/task.routes")
const ai = require("./routes/ai.routes")
const cors = require('cors');

// ====================================================
// 1. CORS CONFIGURATION & PREFLIGHT MIDDLEWARE (SABSE UPAR)
// ====================================================
app.use(cors({
    origin: 'https://taskflow-frontend-brown-psi.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
}));

// Explicit Global Headers & Preflight termination
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://taskflow-frontend-brown-psi.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// ====================================================
// 2. STANDARD MIDDLEWARES & LIMITERS
// ====================================================
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,//1 Minute me
    max: 50,     // Max 50 request 
    message: "Too Many Request From This IP, Please Try after A Minute",
})

app.use(express.json())
app.use(cookieParser());
app.use(limiter); // CORS ke baad rate limit lagega

// ====================================================
// 3. API ROUTES
// ====================================================
app.use('/api/auth', auth);
app.use("/api/boards", board)
app.use("/api/task", task);
app.use('/api/ai', ai);

module.exports = app;