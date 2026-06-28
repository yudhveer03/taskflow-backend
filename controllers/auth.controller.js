const userModel = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('../middleware/express-validator')


module.exports.register = async (req, res) => {

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
        maxAge: 7 * 24 * 60 * 60  * 1000    })
   
    
    res.status(201).json({
        message: "User Regsistered Successfully",
        token
    })
}


module.exports.login = async (req, res) => {
    const { username, password } = req.body
    const user = await userModel.findOne({
        username: username
    })

    if (!user) {
        return res.status(401).json({
            message: "User not registered"})
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password" })
    }

    const token = jwt.sign({ id: user._id, },
        process.env.JWT_SECRET_KEY, {
        expiresIn: '7d'
    })

    res.cookie('token', token)

    return res.status(200).json({
        message: "Login Suucessfull",
    })
}


module.exports.logout = async (req,res)=>{
    res.clearCookie('token')
    res.send("Logout Successfull")
}


