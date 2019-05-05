const
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
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
    app.use(express.static(__dirname + "/public"))
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

    app.get("/campgrounds/:id/comments/new", (req, res) => {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                console.log("Error!", err);
            } else {
                res.render("comments/new", { campground: campground });
            }
        });
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

    app.post("/campgrounds/:id/comments", (req, res) =>{
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                console.log("Error!", err);
            } else {
                Comment.create(req.body.comment, (err, comment)=>{
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
}