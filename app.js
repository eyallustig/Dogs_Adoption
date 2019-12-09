const methodOverride = require('method-override'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    express = require('express'),
    app = express();

// Passport config
require('./config/passport')(passport);

// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(
        db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// A template engine enables you to use static template files in your application. 
// At runtime, the template engine replaces variables in a template file with actual values, 
// and transforms the template into an HTML file sent to the client.
app.set("view engine", "ejs");

// To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static(__dirname + "/public"));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Node.js body parsing middleware.
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({
    extended: true
}));

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// The flash is a special area of the session usedfor storing messages.
// Messages are written to the flash and cleared after being displayed to the user.
// The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.
// Connect flash
app.use(flash());

// Global Vasrs (custom middleware)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.currentUser = req.user;
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/dogs/:id/comments', require('./routes/comments'));
app.use('/dogs', require('./routes/dogs'));
app.use('/users', require('./routes/users'));

// Error handling
app.use(function (err, req, res, next) {
    console.error(err.stack);
    req.flash('error_msg', 'Something went wrong');
    res.redirect('back');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));