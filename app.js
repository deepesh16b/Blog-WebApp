const print = console.log;
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");

// ========MONGODB MONGOOSE============================
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://deepesh16b:atharva1@cluster0.5jmf7ef.mongodb.net/blogDB");

const eachPostSchema = { 
  title : {
    type : String,
    require : true
  },
  content : {
    type : String,
    require : true
  }
};

const EachPost = mongoose.model("EachPost", eachPostSchema);

const allPostSchema = {
  name : String,
  allPostsArray : [eachPostSchema]
};

const AllPost = mongoose.model("AllPost", allPostSchema);

const eachPost = new EachPost({
  title : "Day 1",
  content : "Just ending my day with a coffee!"
});

const defaultArray = [eachPost];

//--MAIN OBJECT FOR STORING ALL POSTS IN ARRAY
const allPost = new AllPost({   
  name : "Main",
  allPostsArray : defaultArray
})

// ============================================================

//----------starting content --------------
const homeStartingContent = "Publish your passions, your way Create a unique and beautiful blog easily.";
const aboutContent = "Since 2023, Hundreds of people have expressed themselves on Daily Journal. From detailed posts about almost every apple variety you could ever imagine to a blog dedicated to the art of blogging itself, the ability to easily share, publish and express oneself on the web is at the core of Daily Journal's mission. As the web constantly evolves, we want to ensure anyone using Daily Journal has an easy and intuitive experience publishing their content to the web.";
const contactContent = " message to convey, just say it anyway and we shall respond accordingly. Send DM";


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// -------------- "/" GET ROUTE --------------------------
app.get("/", function (req, res) {  

  AllPost.find({}, function (error, foundArrayOfObjects) {  
    if(foundArrayOfObjects.length === 0)
    {
        AllPost.insertMany([allPost], function(err)
        {
            if(err) 
                  console.log(err);
            else 
                  console.log("Successfully saved default items to database");
        });
        res.redirect("/");
    }
    else
    {
      const posts = foundArrayOfObjects[0].allPostsArray;
      res.render("home", {content : homeStartingContent, allPosts : posts});
    }
    
  });

});

// --------------CONTACT PAGE ROUTE--------------------------
app.get("/contact", function (req, res) {  
  res.render("contact", {content : contactContent});
});

// --------------ABOUT PAGE ROUTE--------------------------
app.get("/about", function (req, res) {  
  res.render("about", {content : aboutContent});
});

// --------------COMPOSE PAGE ROUTE--------------------------
app.get("/compose", function (req, res) {  
  res.render("compose");
});

// --------------OPEN A POST PAGE WITH 'ID'---------------------
app.post("/posts/:topic", function(req, res){
  const id = req.body.id;
  AllPost.findOne({}, function (err, foundObjectOfCollection) {
    const array = foundObjectOfCollection.allPostsArray;
    array.forEach(Object => {
      if(Object._id == id)
      {
          res.render("post", {post : Object});
      }
    });
      
  });

});

// ------------CREATE A POST( COMPOSE ) ----------------
app.post("/compose", function (req, res) {
  
  const newPost = new EachPost({
    title : req.body.postTitle,
    content : req.body.postBody
  });

  AllPost.findOne({}, function (err, foundObject) {  
    if(!foundObject){
      console.log("FoundObject empty!");
    }
    else{
      
      foundObject.allPostsArray.push(newPost);
      foundObject.save();
      console.log("New Post added in Database!");
      res.redirect("/");
    }
  });

});

// --------------DELETE A POST--------------------------
app.post("/delete", function (req, res) { 
  const id = req.body.id;
  AllPost.findOneAndUpdate({}, {$pull : {allPostsArray : {_id : id}}}, function (err, foundArray) {  
    if(!err)
      console.log("deleted!");
  });

  res.redirect("/");
});

//-----------LISTEN TO PORT --------------------------
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
