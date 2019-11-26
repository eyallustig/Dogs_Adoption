const express = require('express'),
    User = require('../models/User'),
    bcrypt = require('bcryptjs'),
    router = express.Router();

// Login Page
router.get('/login', (req, res) => res.render('users/login'));

// Register Page
router.get('/register', (req, res) => res.render('users/register'));

// Register
router.post('/register', async (req,res) => {
    try {
        const user = req.body.user;
        let errors = [];
    
        if (user.password != user.password2) {
            errors.push({msg: 'Passwords do not match'});
        }
    
        if (errors.length > 0) {
            res.render('users/register', {
                user,
                errors
            });
        } else {
            const user = await User.findOne({ email: email});
            if (user) {
                errors.push({msg: 'Email already exists'});
                res.render('users/register', {
                    user,
                    errors
                });
            } else {
                let newUser = new User({
                    name: user.name,
                    email: user.email,
                    password: user.password
                });

                // Encrypt new user password
            }
        }
        
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;