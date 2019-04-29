const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds");
});

app.listen(
    port = 3000,
    callback = ()=>{
        console.log("Started YelpCamp server");
});