const methodOverride = require('method-override'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    express = require('express'),
    app = express()

// Require and configure dotenv
require('dotenv').config()

// Passport config
require('./config/passport')(passport)

// Connect to MongoDB
mongoose
    .connect(
        process.env.DATABASEURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err))

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Global Vasrs (custom middleware)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    res.locals.currentUser = req.user
    next()
})

// Routes
app.use('/', require('./routes/index'))
app.use('/dogs/:id/comments', require('./routes/comments'))
app.use('/dogs', require('./routes/dogs'))
app.use('/users', require('./routes/users'))

// Error handling
app.use(function (err, req, res, next) {
    console.error(err.stack)
    req.flash('error_msg', 'Something went wrong')
    res.redirect('back')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))