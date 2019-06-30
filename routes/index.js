const
    express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("../models/user");

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Logged out now");
    res.redirect("/campgrounds");
});

router.post("/register", (req, res) => {
    let newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        })
    });
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }));

module.exports = router;