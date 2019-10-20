const express = require("express"),
    port = process.env.PORT || 3000,
    app = express();

// A template engine enables you to use static template files in your application. 
// At runtime, the template engine replaces variables in a template file with actual values, 
// and transforms the template into an HTML file sent to the client.
app.set("view engine", "ejs");

// To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static(__dirname + "/public"));

// landing page
app.get('/', (req, res) => res.render("landing"));

// INDEX - show all pets
app.get('/pets', (req, res) => res.render("pets/index"));

// NEW - show form to create new pet
app.get('/pets/new', (req, res) => res.render("pets/new"));

app.listen(port, () => console.log(`Server listening on port ${port}`));