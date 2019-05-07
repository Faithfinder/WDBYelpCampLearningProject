const
    express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground")
Comment = require("../models/comment");

router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log("Error!", err);
        } else {
            res.render("./campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

router.get("/new", isLoggedIn, (req, res) => {
    res.render("./campgrounds/new");
});

router.post("/", isLoggedIn, (req, res) => {

    req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
    };

    Campground.create(req.body.campground, (err, campground) => {
        if (err) {
            console.log("Error!", err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if (err) {
            console.log("Error!", err);
        } else {
            res.render("./campgrounds/show", { campground: campground });
        }
    })
});

router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render("./campgrounds/edit", { campground: campground });
    })
});
    

router.put("/:id", checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if (err) {
            console.log("Error!", err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

router.delete("/:id", checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err, removedCampground) => {
        if (err) {
            console.log("Error!", err);
        } else {
            Comment.deleteMany({ _id: { $in: removedCampground.comments } }, (err) => {
                if (err) {
                    console.log("Error!", err);
                }
            })
        }
        res.redirect("/campgrounds")
    })
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                console.log("Error!", err);
                res.redirect("back");
            } else {
                if (campground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back")
    }
}

module.exports = router;