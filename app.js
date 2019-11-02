const express = require("express"),
    bodyParser = require("body-parser"),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    app = express();

// requiring routes
const indexRoutes = require("./routes/index"),
    dogRoutes = require("./routes/dogs");

// Node.js body parsing middleware.
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({
    extended: true
}));

// open a connection to the dogs_adoption database on our locally running instance of MongoDB.
mongoose.connect('mongodb://localhost/dogs_adoption', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// get notified if we connect successfully or if a connection error occurs
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to DB successfuly")
});

// A template engine enables you to use static template files in your application. 
// At runtime, the template engine replaces variables in a template file with actual values, 
// and transforms the template into an HTML file sent to the client.
app.set("view engine", "ejs");

// To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static(__dirname + "/public"));

// use the routes
app.use("/", indexRoutes);
// append /dogs to all dog routes
app.use("/dogs", dogRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}`));