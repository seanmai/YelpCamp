// CAMPGROUNDS //
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); // Don't need /index.js, when requiring directory, it will automatically require file named 'index'
var geocoder = require('geocoder');

//INDEX - show all campground
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: campgrounds, page: "campgrounds"});
        }
    });
});

//CREATE - add new campground to db
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add create in db
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var price = req.body.price;
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCampground = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new")
});

// SHOW - shows more info about a single campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        // if(err){
        //     req.flash("error", "Could not find campground");
        // }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE
router.put("/:id", function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
        Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedCampground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + updatedCampground._id);
            }
        });
    });
});
// Former PUT route as reference
// router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
//         if(err){
//             req.flash("error", err.message);
//             res.redirect("back");
//         } else {
//             req.flash("success","Successfully Updated!");
//             res.redirect("/campgrounds/" + req.params.id);
//         }
//     });
// });

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;