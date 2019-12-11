const LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcryptjs')

// Load User model
const User = require('../models/User')

module.exports = (passport) => {
    passport.use(
        new LocalStrategy( async (username, password, done) => {
            try {
                // Match User
                const user = await User.findOne({ username  })
                if (!user) {
                    return done(null, false, {
                        message: 'Username is not registered'
                    })
                }

                // Match passsword
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Incorrect password' })
                    }
                })
            } catch (error) {
                console.log(error)
            }
        })
    )

    passport.serializeUser( (user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser( (id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}