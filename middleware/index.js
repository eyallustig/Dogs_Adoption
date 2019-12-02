const Dog = require('../models/dog');

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
            res.redirect('/dogs')
        }
    } catch (error) {
        console.log(error);
        res.redirect('/back')
    }
}

module.exports = middlewareObj;