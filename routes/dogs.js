const express = require("express"),
    Dog = require("../models/dog"),
    router = express.Router();

// INDEX - show all dogs
router.get('/', async (req, res) => {
    try {
        const allDogs = await Dog.find({});
        res.render("dogs/index", {
            dogs: allDogs
        });
    } catch (error) {
        console.log(error);
    }
});


// NEW - show form to create new pet
router.get('/new', (req, res) => {
    res.render("dogs/new")
});

// CREATE - Create a new dog, then redirect somewhere
router.post('/', async (req, res) => {
    try {
        const newDog = req.body.dog;
        const newlyCreated = await Dog.create(newDog);
        console.log(`Created dog: ${newlyCreated.name}`);
        res.redirect("/dogs");
    } catch (error) {
        console.log(error);
    }
});

// SHOW - shows more info about one dog
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const foundDog = await Dog.findById(id);
        if (!foundDog) {
            res.render("back");
        }
        res.render("dogs/show", { dog: foundDog });
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
});

// EDIT - show edit form for one dog
router.get("/:id/edit", (req, res) => {
    res.send("You hit edit page");
});

module.exports = router;