const express = require('express'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express();

// Node.js body parsing middleware.
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({
    extended: true
}));

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

// Routes
app.use('/', require('./routes/index'));
app.use('/dogs', require('./routes/dogs'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));