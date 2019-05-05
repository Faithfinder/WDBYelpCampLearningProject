const
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
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
                res.render("index", { campgrounds: campgrounds });
            }
        });
    });

    app.get("/campgrounds/new", (req, res) => {
        res.render("new");
    });

    app.get("/campgrounds/:id", (req, res) => {
        Campground.findById(req.params.id).populate("comments").exec( (err, campground) => {
            if (err) {
                console.log("Error!", err);
            } else {
                res.render("show", { campground: campground });
            }
        })

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
}