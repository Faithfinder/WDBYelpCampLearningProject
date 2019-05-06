const
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),

    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");


let mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/yelp_camp"
mongoose.connect(mongoUri, { useNewUrlParser: true });

//seedDB();

setUpServer();
setUpGetRoutes();
setUpPostRoutes();

let port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Started YelpCamp server at port ${port}`);
});


function setUpServer() {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + "/public"));

    app.use(require("express-session")({
        secret: "We'll do keeping it secret later",
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        next();
    });
}

function setUpGetRoutes() {
    app.get("/", (req, res) => {
        res.render("landing");
    });

    app.get("/campgrounds", (req, res) => {
        Campground.find({}, (err, campgrounds) => {
            if (err) {
                console.log("Error!", err);
            } else {
                res.render("./campgrounds/index", { campgrounds: campgrounds });
            }
        });
    });

    app.get("/campgrounds/new", (req, res) => {
        res.render("./campgrounds/new");
    });

    app.get("/campgrounds/:id", (req, res) => {
        Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
            if (err) {
                console.log("Error!", err);
            } else {
                res.render("./campgrounds/show", { campground: campground });
            }
        })

    });

    app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                console.log("Error!", err);
            } else {
                res.render("comments/new", { campground: campground });
            }
        });
    });

    app.get("/register", (req, res) => {
        res.render("register");
    });

    app.get("/login", (req, res) => {
        res.render("login");
    });

    app.get("/logout", (req, res) => {
        req.logOut();
        res.redirect("/campgrounds");
    });

}

function setUpPostRoutes() {
    app.post("/campgrounds", (req, res) => {

        let campground = {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description
        };

        Campground.create(campground, (err, campground) => {
            if (err) {
                console.log("Error!", err);
            } else {
                res.redirect("/campgrounds");
            }
        });
    });

    app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                console.log("Error!", err);
            } else {
                Comment.create(req.body.comment, (err, comment) => {
                    if (err) {
                        console.log("Error!", err);
                    } else {
                        campground.comments.push(comment);
                        campground.save();
                        res.redirect("/campgrounds/" + campground._id);
                    }
                });

            }
        });
    });

    app.post("/register", (req, res) => {
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

    app.post("/login", passport.authenticate("local",
        {
            successRedirect: "/campgrounds",
            failureRedirect: "/login"
        }));
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}