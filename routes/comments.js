const middleware = require('../middleware/index'),
    Dog = require('../models/dog'),
    Comment = require('../models/Comment'),
    express = require('express'),
    router = express.Router({mergeParams: true});

// Comment Page
router.get('/new', middleware.isLoggedIn, async (req, res) => {
    try {
        const foundDog = await Dog.findById(req.params.id);
        if (!foundDog) {
            req.flash('error_msg', 'Dog not found');
            req.redirect('/dogs');
        } else {
            res.render('comments/new', { foundDog });
        }
    } catch (error) {
        console.log(error);
        res.redirect('back')
    }
});

// Create comment
router.post('/', middleware.isLoggedIn , async (req, res) => {
    try {
        const dogId = req.params.id;
        const foundDog = await Dog.findById(dogId);
        if (!foundDog) {
            req.flash('error_msg', 'Dog not found');
            res.redirect('/dogs');
        } else {
            const { comment } = req.body;
            comment.author = {
                id: req.user._id,
                username: req.user.username
            }
            const newComment = await Comment.create(comment);
            await foundDog.comments.push(newComment);
            await foundDog.save();
            req.flash('success_msg', 'Successfully added comment');
            res.redirect(`/dogs/${dogId}`);
        }
    } catch (error) {
        console.log(error);
        res.redirect('back')
    }
});

module.exports = router;