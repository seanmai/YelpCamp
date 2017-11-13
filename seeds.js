var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
    {
        name: "Waiparous", 
        image: "http://www.volkswagenhaven.net/images/waiparous-04/DSC_5323.jpg",
        description: "Lorem ipsum dolor sit amet, leo gravida nonummy lorem sed quam. Vestibulum adipiscing, odio odio magna amet pellentesque duis. A egestas sem et diam, eu morbi velit netus, eros quisque et aenean quis, blandit magna. Habitasse non odio consectetuer hac odio, nec praesent tempor mauris eros. Neque litora nulla metus ullamcorper, suspendisse nam massa elit sociis orci accumsan, nec metus et."
    },
    {
        name: "Dutch Creek", 
        image: "http://www.dutchcreekresort.com/wp-content/uploads/2013/01/Dutch-Creek-7.jpg",
        description: "Lorem ipsum dolor sit amet, leo gravida nonummy lorem sed quam. Vestibulum adipiscing, odio odio magna amet pellentesque duis. A egestas sem et diam, eu morbi velit netus, eros quisque et aenean quis, blandit magna. Habitasse non odio consectetuer hac odio, nec praesent tempor mauris eros. Neque litora nulla metus ullamcorper, suspendisse nam massa elit sociis orci accumsan, nec metus et."
    },
    {
        name: "Kananaskis Country", 
        image: "http://www.albertawow.com/campgrounds/Interlakes_campground/Interlakes%20Campground%208355.JPG",
        description: "Lorem ipsum dolor sit amet, leo gravida nonummy lorem sed quam. Vestibulum adipiscing, odio odio magna amet pellentesque duis. A egestas sem et diam, eu morbi velit netus, eros quisque et aenean quis, blandit magna. Habitasse non odio consectetuer hac odio, nec praesent tempor mauris eros. Neque litora nulla metus ullamcorper, suspendisse nam massa elit sociis orci accumsan, nec metus et."
    }
];

function seedDB(){
    // Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } else{ 
            console.log("Removed Campgrounds.");
            // Add some campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Added a campground.")
                        // Create a comment
                        Comment.create(
                            {
                                text: "This place is great but I wish there was cell connection",
                                author: "Roger"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created a comment");
                                }
                            });
                    }
                });
            });
        }
    });

    
}

module.exports = seedDB;