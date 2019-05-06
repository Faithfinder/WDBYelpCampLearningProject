const
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),

    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

const
    commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")


let mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/yelp_camp"
mongoose.connect(mongoUri, { useNewUrlParser: true, useFindAndModify: false });

//seedDB();

setUpServer();

let port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Started YelpCamp server at port ${port}`);
});


function setUpServer() {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + "/public"));
    app.use(methodOverride("_method"));

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

    app.use(indexRoutes);
    app.use("/campgrounds", campgroundRoutes);
    app.use("/campgrounds/:id/comments", commentRoutes);
}


