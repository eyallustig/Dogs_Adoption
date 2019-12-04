const Dog = require('../models/dog'),
    Comment = require('../models/Comment');

// All the middleware goes here
let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'You need to be logged in to do that');
    res.redirect('/users/login');
}

middlewareObj.checkDogAuthor = async (req, res, next) => {
    try {
        // get dog from DB
        const { id } = req.params;
        const foundDog = await Dog.findById(id);
        if (!foundDog) {
            req.flash('error_msg', 'Dog not found');
            res.redirect('/dogs');
        } else {
            // check dog ownership
            if (foundDog.author.id.equals(req.user._id)) {
                return next();
            }
            req.flash('error_msg', 'You don\'t have premission to do that');
            res.redirect(`/dogs/${id}`);
        }
    } catch (error) {
        console.log(error);
        res.redirect(`/dogs/${id}`);
    }
}

middlewareObj.checkCommentAuthor = async (req, res, next) => {
    const {id, comment_id} = req.params;
    try {
        const comment = await Comment.findById(comment_id);
        if (!comment) {
            req.flash('error_msg', 'Comment not found');
        } else {
            if (comment.author.id.equals(req.user._id)) {
                return next();
            } else {
                req.flash('error_msg', 'You don\'t have premission to do that');
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        res.redirect(`/dogs/${id}`);
    }
}

module.exports = middlewareObj;