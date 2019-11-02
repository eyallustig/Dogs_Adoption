const express = require("express"),
    Dog = require("../models/dog"),
    router = express.Router();

// INDEX - show all dogs
router.get('/', (req, res) => {
    Dog.find({}, (err, allDogs) => {
        if (err) {
            console.log(err);
        } else {
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

// SHOW - shows more info about one dog
router.get("/:id", (req, res) => {
    // find the dog with the provided id
    const { id } = req.params;
    Dog.findById(id).exec((err, foundDog) => {
        if (err || !foundDog) {
            res.redirect("back");
        } else {
            res.render("dogs/show", {
                dog: foundDog
            });
        }
    });
});

module.exports = router;