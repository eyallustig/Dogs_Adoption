const Dog = require('../models/dog'),
    Comment = require('../models/Comment')

// All the middleware goes here
let middlewareObj = {}

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error_msg', 'You need to be logged in to do that')
    res.redirect('/users/login')
}

middlewareObj.checkDogAuthor = async (req, res, next) => {
    try {
        const { id } = req.params
        // Check if user logged in
        if (req.isAuthenticated()) {
            const foundDog = await Dog.findById(id)
            if (!foundDog) {
                req.flash('error_msg', 'Dog not found')
                res.redirect('/dogs')
            } else {
                // check dog ownership
                if (foundDog.author.id.equals(req.user._id)) {
                    return next()
                }
                req.flash('error_msg', 'You don\'t have premission to do that')
                res.redirect(`/dogs/${id}`)
            }
        } else {
            req.flash('error_msg', 'You don\'t have premission to do that')
            res.redirect(`/dogs/${id}`)
        }
    } catch (error) {
        next(error) // Pass errors to Express.
    }
}

middlewareObj.checkCommentAuthor = async (req, res, next) => {
    try {
        const { id, commentId } = req.params
        // Check if user logged in
        if (req.isAuthenticated()) {
            const comment = await Comment.findById(commentId)
            if (!comment) {
                req.flash('error_msg', 'Comment not found')
                res.redirect(`/dogs/${id}`)
            } else {
                if (comment.author.id.equals(req.user._id)) {
                    return next()
                } else {
                    req.flash('error_msg', 'You don\'t have premission to do that')
                    res.redirect(`/dogs/${id}`)
                }
            }
        } else {
            req.flash('error_msg', 'You don\'t have premission to do that')
            res.redirect(`/dogs/${id}`)
        }
    } catch (error) {
        next(error) // Pass errors to Express.
    } 
}

module.exports = middlewareObj