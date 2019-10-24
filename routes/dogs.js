const express = require("express"),
    router = express.Router();

// INDEX - show all pets
router.get('/', (req, res) => {
    res.render("dogs/index")
});

// NEW - show form to create new pet
router.get('/new', (req, res) => {
    res.render("dogs/new")
});

// CREATE - Create a new dog, then redirect somewhere
router.post('/', (req, res) => {
    console.log(req.body.dog);
    // create a new dog and save to DB

    res.redirect("/dogs");
});

module.exports = router;