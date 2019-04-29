const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    var sampleCampgrounds = [
        {name: "Campground 1", image: "https://farm8.staticflickr.com/7285/8737935921_47343b7a5d.jpg"},
        {name: "Campground 2", image: "https://farm9.staticflickr.com/8471/8137270056_21d5be6f52.jpg"},
        {name: "Campground 3", image: "https://farm3.staticflickr.com/2924/14465824873_026aa469d7.jpg"}
    ];
    res.render("campgrounds", {campgrounds: sampleCampgrounds});
});

app.listen(
    port = 3000,
    callback = ()=>{
        console.log("Started YelpCamp server");
});