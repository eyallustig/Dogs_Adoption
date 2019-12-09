const express = require('express'),
    Dog = require('../models/dog'),
    Comment = require('../models/Comment'),
    middleware = require('../middleware/index'),
    moment = require('moment'),
    router = express.Router()

// INDEX - show all dogs
router.get('/', async (req, res, next) => {
    try {
        const allDogs = await Dog.find();
        res.render('dogs/index', { allDogs })
    } catch (error) {
        next(error) // Pass errors to Express.
    }
})

// NEW - show form to create new dog
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('dogs/new')
})

// CREATE - Create a new dog, then redirect somewhere
router.post('/', middleware.isLoggedIn, async (req, res, next) => {
    try {
        const { dog } = req.body
        dog.author = {
            id: req.user._id,
            username: req.user.username
        }
        const newlyCreated = await Dog.create(dog)
        console.log(`Created dog: ${newlyCreated.name}`)
        req.flash('success_msg', `Successfully added ${newlyCreated.name}`)
        res.redirect('/dogs')
    } catch (error) {
        next(error) // Pass errors to Express.
    } 
})

// SHOW - shows more info about one dog
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const dog = await Dog.findById(id).populate('comments')
        if (!dog) {
            req.flash('error_msg', 'Dog not found')
            res.redirect('/dogs')
        } else {
            // replace all line breaks in a string with <br> tags
            dog.description = replaceLineBreak(dog.description)

            // calculate time passed for each comment
            dog.comments = calcTimePassed(dog.comments)
            res.render('dogs/show', {dog})
        }
    } catch (error) {
        next(error) // Pass errors to Express.
    }
})

// EDIT - show edit form for one dog
router.get('/:id/edit', middleware.checkDogAuthor, async (req, res, next) => {
    try {
        const { id } = req.params
        const dog = await Dog.findById(id)
        if (!dog) {
            req.flash('error_msg', 'Dog not found')
            res.redirect('/dogs')
        } else {
            res.render('dogs/edit', {dog})
        }
    } catch (error) {
        next(error) // Pass errors to Express.
    }
})

// UPDATE - update a particular dog and then redirect somewhere
router.put('/:id', middleware.checkDogAuthor, async (req, res, next) => {
    try {
        const { id } = req.params
        const { dog } = req.body
        const updatedDog = await Dog.findByIdAndUpdate(id, dog)
        if (!updatedDog) {
            req.flash('error_msg', 'Dog not found')
            res.redirect('/dogs')
        } else {
            req.flash('success_msg', `Successfully edited ${updatedDog.name}`)
            res.redirect(`/dogs/${id}`)
        }
    } catch (error) {
        next(error) // Pass errors to Express.
    }
})

// DELETE - delete a particular dog, then redirect somewhere
router.delete('/:id', middleware.checkDogAuthor, async (req, res, next) => {
    try {
        const { id } = req.params
        const foundDog = await Dog.findById(id)
        if (!foundDog) {
            req.flash('error_msg', 'Dog not found')
            res.redirect('/dogs')
        } else {
            // Delete dog comments
            const deleteCommentStatus = await Comment.deleteMany({
                _id: {
                    $in: foundDog.comments
                }
            })
            console.log(deleteCommentStatus)
            // Delete dog
            const deleteDogStatus = await Dog.deleteOne({_id: id})
            console.log(deleteDogStatus)
            req.flash('success_msg', `Successfully deleted ${foundDog.name}`)
            res.redirect('/dogs')
        }
    } catch (error) {
        next(error) // Pass errors to Express.
    }
});

// replace all line breaks in a string with <br> tags
const replaceLineBreak = str => str.replace(/(?:\r\n|\r|\n)/g, '<br>')

// calculate time passed for each comment
const calcTimePassed = comments => {
    comments.forEach(comment => comment.timePassed = moment(comment.date).fromNow())
    return comments
}

module.exports = router;