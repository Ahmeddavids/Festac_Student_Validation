const UserModel = require('../model/userModel');
// Import Hapi/Joi
const Joi = require('@hapi/joi');

const schema = Joi.object({
    firstName: Joi.string().min(3).trim().required().pattern(/^\s*[A-Za-z]+\s*$/).messages({
        "any.required": "Please provide First name.",
        "string.empty": "First name cannot be left empty.",
        "string.min": "First name must be at least 3 characters long.",
        "string.pattern.base":
            "First name should only contain letters.",
    }),
    lastName: Joi.string().min(3).trim().required(),
    email: Joi.string().trim().email(),
    age: Joi.number().integer().required(),
    password: Joi.string().required().pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$")).messages({
        "any.required": "Please provide a password.",
        "string.empty": "Password cannot be left empty.",
        "string.pattern.base":
            "Password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
    }),
})




exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, age, password, email } = req.body;

        const { error } = await schema.validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        const userExists = await UserModel.findOne({ email: email.toLowerCase() });
       
        if (userExists) {
            return res.status(404).json({
                message: `User with Email already exists`
            })
        }
        const user = new UserModel({
            firstName,
            lastName,
            email: email.toLowerCase(),
            age,
            password
        });
        await user.save();
        res.status(201).json({
            message: 'User created successfully',
            data: user
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.logIn = async (req, res) => {
    try {
        // Extract the email and password from the request body
        const { email, password } = req.body;
        // Find the user with the email
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        // Check if the user is existing in the database
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        // Confirm the user's password
        if (user.password !== password) {
            return res.status(400).json({
                message: 'Incorrect Password'
            })
        }
        res.status(200).json({
            message: 'Login successfully',
            data: user
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.allUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json({
            message: 'All users in the Database',
            data: users
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
