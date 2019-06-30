const
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("back")
    }

    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log("Error!", err);
            return res.redirect("back");
        }
        if (!userOwnsObject(campground, req.user)) {
            return res.redirect("back");
        }
        next();
    })
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("back")
    }

    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            console.log("Error!", err);
            return res.redirect("back");
        }
        if (!userOwnsObject(comment, req.user)) {
            return res.redirect("back");
        }
        next();
    })
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Login first");
    res.redirect("/login");
};

function userOwnsObject(object, user) {
    return object.author.id.equals(user._id)
}

module.exports = middlewareObj;