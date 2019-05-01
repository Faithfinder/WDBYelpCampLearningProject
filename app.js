const express = require("express");
const app = express();
const bodyParser = require("body-parser");

let sampleCampgrounds = [
    { name: "Campground 1", image: "https://farm8.staticflickr.com/7285/8737935921_47343b7a5d.jpg" },
    { name: "Campground 2", image: "https://farm9.staticflickr.com/8471/8137270056_21d5be6f52.jpg" },
    { name: "Campground 3", image: "https://farm3.staticflickr.com/2924/14465824873_026aa469d7.jpg" }
];

setUpServer();
setUpGetRoutes();
setUpPostroutes();

let port = process.env.PORT || 3000

app.listen(port, () => {
        console.log("Started YelpCamp server");
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
        
        res.render("campgrounds", { campgrounds: sampleCampgrounds });
    });

    app.get("/campgrounds/new", (req, res) => {
        res.render("new");
    });
}

function setUpPostroutes() {
    app.post("/campgrounds", (req, res) => {
        let campground = {
            name: req.body.name,
            image: req.body.image
        };
        sampleCampgrounds.push(campground);
        res.redirect("/campgrounds");
    });
}