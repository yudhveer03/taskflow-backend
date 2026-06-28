const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Please Login First"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    
        req.user = decoded

        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}

