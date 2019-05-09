const
    express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log("Error!", err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log("Error!", err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log("Error!", err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            console.log("Error!", err);
            return res.redirect("back");
        }
        res.render("comments/edit", {
            campground_id: req.params.id,
            comment: comment
        })
    });
});

router.put("/:comment_id/", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
        if (err) {
            console.log("Error!", err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

router.delete("/:comment_id/",middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err, comment) => {
        if (err) {
            console.log("Error!", err);
        }
        res.redirect("/campgrounds/" + req.params.id);
    })
});

module.exports = router;