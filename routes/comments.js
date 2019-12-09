const middleware = require('../middleware/index'),
    Dog = require('../models/dog'),
    Comment = require('../models/Comment'),
    express = require('express'),
    router = express.Router({ mergeParams: true })

// NEW - show form to create new comment
router.get('/new', middleware.isLoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params
        const foundDog = await Dog.findById(id)
        if (!foundDog) {
            console.log('Reached here!!!')
            req.flash('error_msg', 'Dog not found')
            res.redirect('/dogs')
        } else {
            res.render('comments/new', { foundDog })
        }
    } catch (error) {
        next(error) // Pass errors to Express.
    }
})

// CREATE - Create a new comment, then redirect somewhere
router.post('/', middleware.isLoggedIn, async (req, res, next) => {
    try {
        const dogId = req.params.id
        const foundDog = await Dog.findById(dogId)
        if (!foundDog) {
            req.flash('error_msg', 'Dog not found')
            res.redirect('/dogs')
        } else {
            const { comment } = req.body
            comment.author = {
                id: req.user._id,
                username: req.user.username
            }
            const newComment = await Comment.create(comment)
            foundDog.comments.push(newComment)
            await foundDog.save()
            req.flash('success_msg', 'Successfully added comment')
            res.redirect(`/dogs/${dogId}`)
        }
    } catch (error) {
        next(error) // Pass errors to Express.
    }
})

// EDIT - show edit form for one comment
router.get('/:commentId/edit', middleware.checkCommentAuthor, async (req, res, next) => {
    try {
        const { id, commentId } = req.params
        const foundComment = await Comment.findById(commentId)
        if (!foundComment) {
            req.flash('error_msg', 'Comment not found')
            res.redirect(`/dogs/${id}`)
        } else {
            res.render('comments/edit', {
                id,
                foundComment
            })
        }
    } catch (error) {
        next(error) // Pass errors to Express.
    }
})

// UPDATE - update a particular comment and then redirect somewhere
router.put('/:commentId', middleware.checkCommentAuthor, async (req, res, next) => {
    try {
        const editedText = req.body.text
        const { id, commentId } = req.params
        const foundComment = await Comment.findById(commentId)
        if (!foundComment) {
            req.flash('error_msg', 'Comment not found')
            res.redirect(`/dogs/${id}`)
        } else {
            foundComment.text = editedText
            foundComment.date = Date.now()
            await foundComment.save()
            req.flash('success_msg', 'Successfully edited comment')
            res.redirect(`/dogs/${id}`)
        }
    } catch (error) {
        next(error) // Pass errors to Express.
    }
})

// DELETE - delete a particular comment, then redirect somewhere
router.delete('/:commentId', middleware.checkCommentAuthor, async (req, res, next) => {
    try {
        const { id, commentId } = req.params
        const deleteStatus = await Comment.deleteOne({ _id: commentId })
        console.log(deleteStatus)
        req.flash('success_msg', 'Successfully deleted comment')
        res.redirect(`/dogs/${id}`)
    } catch (error) {
        next(error) // Pass errors to Express.
    }
})

module.exports = router