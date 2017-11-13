var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //Check if user is logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                //Check if user owns campground post
                if(foundCampground.author.id.equals(req.user._id)){ //.equals is used over === , .author.id is mongoose object, req.user._id is String
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that.")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must log in to continue.")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    //Check if user is logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                //Check if user owns comment
                if(foundComment.author.id.equals(req.user._id)){ //.equals is used over === , .author.id is mongoose object, req.user._id is String
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must log in to continue.");
        res.redirect("back");
    }
}

// Login auth middleware
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must log in to continue.");
    res.redirect("/login");
}


module.exports = middlewareObj;