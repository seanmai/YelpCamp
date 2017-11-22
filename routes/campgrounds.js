// CAMPGROUNDS //
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); // Don't need /index.js, when requiring directory, it will automatically require file named 'index'
var geocoder = require('geocoder');
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'seanmai',
  api_key: "314767545221239",
  api_secret: "8-g_2pFJy-GKHkgNFhGANLm3uUg"
});

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
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    //get data from form and add create in db
    geocoder.geocode(req.body.location, function (err, data){
        req.body.campground.lat = data.results[0].geometry.location.lat;
        req.body.campground.lng = data.results[0].geometry.location.lng;
        req.body.campground.location = data.results[0].formatted_address;
        cloudinary.uploader.upload(req.file.path, function(result) {
            // add cloudinary url for the image to the campground object under image property
            req.body.campground.image = result.secure_url;
            // add author to campground
            req.body.campground.author = {
                id: req.user._id,
                username: req.user.username
            }
            Campground.create(req.body.campground, function(err, campground) {
                if (err) {
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                res.redirect('/campgrounds/' + campground.id);
            });
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
    geocoder.geocode(req.body.location, function (err, data){
        req.body.campground.lat = data.results[0].geometry.location.lat;
        req.body.campground.lng = data.results[0].geometry.location.lng;
        req.body.campground.location = data.results[0].formatted_address;
        cloudinary.uploader.upload(req.file.path, function(result) {
            // add cloudinary url for the image to the campground object under image property
            req.body.campground.image = result.secure_url;
            // add author to campground
            req.body.campground.author = {
                id: req.user._id,
                username: req.user.username
            }
            Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
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
