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
        res.redirect("back");
    }
});

// NEW - show form to create new dog
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
        res.redirect("back");
    }
});

// SHOW - shows more info about one dog
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let foundDog = await Dog.findById(id);
        // replace all line breaks in a string with <br> tags
        foundDog.description = foundDog.description.replace(/(?:\r\n|\r|\n)/g, '<br>');
        if (!foundDog) {
            res.render("back");
        } else {
            res.render("dogs/show", { dog: foundDog });
        }
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
});

// EDIT - show edit form for one dog
router.get("/:id/edit", async (req, res) => {
    try {
        const { id } = req.params;
        const foundDog = await Dog.findById(id);
        if (!foundDog) {
            res.render("back");
        } else {
            res.render("dogs/edit", { dog: foundDog });
        }
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
});

// UPDATE - update a particular dog and then redirect somewhere
router.put("/:id", async (req,res) => {
    try {
        const { id } = req.params;
        const { dog } = req.body;
        const updatedDog = await Dog.findByIdAndUpdate(id, dog);
        if (!updatedDog) {
            res.redirect("/dogs");
        } else {
            res.redirect(`/dogs/${id}`);
        }
    } catch (error) {
        
    }

});

// DELETE - delete a particular dog, then redirect somewhere
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteStatus = await Dog.deleteOne({ id : id });
        console.log(deleteStatus);
        res.redirect("/dogs");
    } catch (error) {
        
    }
});

module.exports = router;