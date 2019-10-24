const express = require("express"),
    Dog = require("../models/dog"),
    router = express.Router();

// INDEX - show all dogs
router.get('/', (req, res) => {
    Dog.find({}, (err, allDogs) => {
        if (err) {
            console.log(err);
        } else {
            console.log(allDogs);
            res.render("dogs/index", {
                dogs: allDogs
            });
        }
    });
});

// NEW - show form to create new pet
router.get('/new', (req, res) => {
    res.render("dogs/new")
});

// CREATE - Create a new dog, then redirect somewhere
router.post('/', (req, res) => {
    let newDog = req.body.dog;
    console.log(newDog);
    // create a new dog and save to DB
    Dog.create(newDog, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Created dog: ${newlyCreated.name}`);
            res.redirect("/dogs");
        }
    })
});

module.exports = router;