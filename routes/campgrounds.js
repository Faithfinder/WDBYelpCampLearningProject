const
    express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");

router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log("Error!", err);
        } else {
            res.render("./campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

router.get("/new", (req, res) => {
    res.render("./campgrounds/new");
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

router.post("/", (req, res) => {
    console.log(req.body.campground);
    Campground.create(req.body.campground, (err, campground) => {
        if (err) {
            console.log("Error!", err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;