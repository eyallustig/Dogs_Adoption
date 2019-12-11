const express = require('express'),
    User = require('../models/User'),
    passport = require('passport'),
    bcrypt = require('bcryptjs'),
    router = express.Router()
    
// Register Page
router.get('/register', (req, res) => res.render('users/register'))

// Register Handle
router.post('/register', async (req, res, next) => {
    try {
        const { user } = req.body
        const { username, password, password2 } = user
        let errors = []

        if (password !== password2) {
            errors.push( {msg: 'Passwords do not match'} )
        }

        if (errors.length > 0) {
            res.render('users/register', {
                username,
                errors
            })
        } else {
            const userDB = await User.findOne( {username} )
            // Username exist
            if (userDB) {
                errors.push( {msg: 'Username is already registered'} )
                res.render('users/register', {
                    username,
                    errors
                })
            } else {
                const newUser = new User( {username, password} )
                // Hash password
                bcrypt.genSalt(10, async (err, salt) => {
                    bcrypt.hash(newUser.password, salt, async (err, hash) => {
                        // Store hash in your password DB.
                        newUser.password = hash
                        await newUser.save()
                        req.flash('success_msg', 'You are now registered and can log in')
                        res.redirect("/users/login")
                    })
                })
            }
        }
    } catch (error) {
        next(error) // Pass errors to Express.
    }
})

// Login Page
router.get('/login', (req, res) => res.render('users/login'))

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dogs',
        failureRedirect: '/users/login',
        failureFlash: true,
        successFlash: 'Welcome back'
    })(req, res, next)
})

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash("error_msg", 'Logged you out')
    res.redirect('/dogs')
})

module.exports = router