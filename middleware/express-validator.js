const { body, validationResult } = require('express-validator')


function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next(); 
}


const registerValidationRules = [
    body('username')
        .isString().withMessage("Username must be a string")
        .isLength({ min: 3 }).withMessage("Username must be grater than 3 character"),
    body('email')
        .custom((value) => {
            const checkEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!checkEmail.test(value)) {
                throw new Error('Invalid Email')
            }
            return true
        })
        
        .optional()
        .isEmail().withMessage('Invalid Email'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be greater than 6 character'),
    validate
]

module.exports = {registerValidationRules}
