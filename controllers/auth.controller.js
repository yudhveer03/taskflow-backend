const userModel = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('../middleware/express-validator')

module.exports.register = async (req, res) => {
    // EXACT FIX: Added try...catch block to prevent server hang
    try {
        const { username, password, email } = req.body
        const hashPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            password: hashPassword,
            email
        })

        const token = jwt.sign({ id: user._id, },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message: "User Registered Successfully",
            token
        })
    } catch (error) {
        // EXACT FIX: Catch database errors (like duplicate emails) and return a proper response
        console.error("Registration Error:", error);
        return res.status(500).json({
            message: "Registration failed. Email might already exist.",
            error: error.message
        });
    }
}

module.exports.login = async (req, res) => {
    // EXACT FIX: Added try...catch block to login as well
    try {
        const { username, password } = req.body
        const user = await userModel.findOne({
            username: username
        })

        if (!user) {
            return res.status(401).json({
                message: "User not registered"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        const token = jwt.sign({ id: user._id, },
            process.env.JWT_SECRET_KEY, {
            expiresIn: '7d'
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "Login Successfull",
        })
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error during login" });
    }
}

module.exports.logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
    res.send("Logout Successfull")
}