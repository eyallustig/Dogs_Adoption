const middleware = require('../middleware/index'),
    Dog = require('../models/dog'),
    Comment = require('../models/Comment'),
    express = require('express'),
    router = express.Router({
        mergeParams: true
    });

// Comment Page
router.get('/new', middleware.isLoggedIn, async (req, res) => {
    try {
        const foundDog = await Dog.findById(req.params.id);
        if (!foundDog) {
            req.flash('error_msg', 'Dog not found');
            req.redirect('/dogs');
        } else {
            res.render('comments/new', {
                foundDog
            });
        }
    } catch (error) {
        console.log(error);
        res.redirect('back')
    }
});

// Create comment
router.post('/', middleware.isLoggedIn, async (req, res) => {
    try {
        const dogId = req.params.id;
        const foundDog = await Dog.findById(dogId);
        if (!foundDog) {
            req.flash('error_msg', 'Dog not found');
            res.redirect('/dogs');
        } else {
            const {
                comment
            } = req.body;
            comment.author = {
                id: req.user._id,
                username: req.user.username
            }
            const newComment = await Comment.create(comment);
            foundDog.comments.push(newComment);
            await foundDog.save();
            req.flash('success_msg', 'Successfully added comment');
            res.redirect(`/dogs/${dogId}`);
        }
    } catch (error) {
        console.log(error);
        res.redirect('back')
    }
});

// Edit comment page
router.get('/:comment_id/edit', [middleware.isLoggedIn, middleware.checkCommentAuthor] , async (req, res) => {
    try {
        const dogId = req.params.id;
        const comment_id = req.params.comment_id;
        // find the comment
        const foundComment = await Comment.findById(comment_id);
        if (!foundComment) {
            req.flash('error_msg', 'Comment not found');
            res.redirect(`/dogs/${dogId}`);
        } else {
            res.render('comments/edit', {
                dogId,
                foundComment
            });
        }
    } catch (error) {
        console.log(error);
        res.redirect(`/dogs/${dogId}`);
    }
});

// Edit comment
router.put('/:comment_id', [middleware.isLoggedIn, middleware.checkCommentAuthor], async (req, res) => {
    try {
        const editedText = req.body.text;
        const comment_id = req.params.comment_id;
        const dog_id = req.params.id;
        const comment = await Comment.findById(comment_id);
        comment.text = editedText;
        comment.date = Date.now();
        await comment.save();
        req.flash('success_msg', 'Successfully edited comment');
        res.redirect(`/dogs/${dog_id}`);
    } catch (error) {
        console.log(error);
        res.redirect('back');
    }
});

// Delete comment
router.delete('/:comment_id', [middleware.isLoggedIn, middleware.checkCommentAuthor], async (req, res) => {
    try {
        const dog_id = req.params.id;
        const {
            comment_id
        } = req.params;
        const deleteStatus = await Comment.deleteOne({
            _id: comment_id
        });
        console.log(deleteStatus);
        req.flash('success_msg', 'Successfully deleted comment');
        res.redirect(`/dogs/${dog_id}`);
    } catch (error) {
        console.log(error);
        res.redirect('back');
    }
});
module.exports = router;