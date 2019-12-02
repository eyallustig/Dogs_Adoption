const express = require('express'),
    User = require('../models/User'),
    passport = require('passport'),
    bcrypt = require('bcryptjs'),
    router = express.Router();

// Login Page
router.get('/login', (req, res) => res.render('users/login'));

// Register Page
router.get('/register', (req, res) => res.render('users/register'));

// Register
router.post('/register', async (req, res) => {
    try {
        const user = req.body.user;
        const {
            username,
            password,
            password2
        } = user;
        let errors = [];

        if (password != password2) {
            errors.push({
                msg: 'Passwords do not match'
            });
        }

        if (errors.length > 0) {
            res.render('users/register', {
                username,
                errors
            });
        } else {
            // Check if a user have already registered with the provided email
            const userDB = await User.findOne({
                username
            });
            // Username is already registered
            if (userDB) {
                errors.push({
                    msg: 'Username is already registered'
                });
                res.render('users/register', {
                    username,
                    errors
                });
            }
            // Username not registered 
            else {
                let newUser = new User({
                    username,
                    password
                });

                // Hash password
                bcrypt.genSalt(10, async (err, salt) => {
                    bcrypt.hash(newUser.password, salt, async (err, hash) => {
                        // Store hash in your password DB.
                        newUser.password = hash;
                        await newUser.save();
                        // Set a flash message by passing the key, followed by the value, to req.flash()
                        req.flash('success_msg', 'You are now registered and can log in')
                        res.redirect("/users/login");
                    });
                });
            }
        }

    } catch (error) {
        console.error(error);
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dogs',
        failureRedirect: '/users/login',
        failureFlash: true,
        successFlash: 'Welcome back'
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash("error", 'Logged you out!');
    res.redirect('/dogs');
});

router.get('/test', (req, res) => {
    return res.redirect('/users/login');
    console.log('Still going!!!');
})

module.exports = router;