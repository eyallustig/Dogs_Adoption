const express = require('express'),
    Dog = require('../models/dog'),
    middleware = require('../middleware/index'),
    router = express.Router();

// INDEX - show all dogs
router.get('/', async (req, res) => {
    try {
        const dogs = await Dog.find();
        res.render('dogs/index', {
            dogs
        });
    } catch (error) {
        console.log(error);
        res.redirect('back');
    }
});

// NEW - show form to create new dog
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('dogs/new')
});

// CREATE - Create a new dog, then redirect somewhere
router.post('/', middleware.isLoggedIn, async (req, res) => {
    try {
        let newDog = req.body.dog;
        newDog.author = {
            id: req.user._id,
            username: req.user.username
        }
        const newlyCreated = await Dog.create(newDog);
        console.log(`Created dog: ${newlyCreated.name}`);
    } catch (error) {
        console.log(error);
    } finally {
        res.redirect('/dogs');
    }
});

// SHOW - shows more info about one dog
router.get('/:id', async (req, res) => {
    try {
        const {
            id
        } = req.params;
        let foundDog = await Dog.findById(id);
        if (!foundDog) {
            req.flash('error_msg', 'Dog not found');
            res.redirect('/dogs');
        } else {
            // replace all line breaks in a string with <br> tags
            foundDog.description = foundDog.description.replace(/(?:\r\n|\r|\n)/g, '<br>');
            res.render('dogs/show', {
                dog: foundDog
            });
        }
    } catch (error) {
        console.log(error);
        res.redirect('/dogs');
    }
});

// EDIT - show edit form for one dog
router.get('/:id/edit', [middleware.isLoggedIn, middleware.checkDogAuthor] , async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const foundDog = await Dog.findById(id);
        if (!foundDog) {
            req.flash('error_msg', 'Dog not found');
            res.redirect('/dogs');
        } else {
            res.render('dogs/edit', {
                dog: foundDog
            });
        }
    } catch (error) {
        console.log(error);
        res.redirect('/dogs');
    }
});

// UPDATE - update a particular dog and then redirect somewhere
router.put('/:id', [middleware.isLoggedIn, middleware.checkDogAuthor], async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const {
            dog
        } = req.body;
        const updatedDog = await Dog.findByIdAndUpdate(id, dog);
        if (!updatedDog) {
            req.flash('error_msg', 'Dog not found');
            res.redirect('/dogs');
        } else {
            res.redirect(`/dogs/${id}`);
        }
    } catch (error) {
        console.log(error);
        res.redirect('/dogs');
    }
});

// DELETE - delete a particular dog, then redirect somewhere
router.delete('/:id', [middleware.isLoggedIn, middleware.checkDogAuthor], async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const deleteStatus = await Dog.findByIdAndDelete(id);
        if (!deleteStatus) {
            req.flash('error_msg', 'Dog not found');
        }
    } catch (error) {
        console.log(error);
    } finally {
        res.redirect('/dogs');
    }
});

module.exports = router;