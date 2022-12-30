//jshint esversion:6

const print = console.log;

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");

//----------starting content --------------
const homeStartingContent = "Publish your passions, your way Create a unique and beautiful blog easily.";
const aboutContent = "Since 2023, Hundreds of people have expressed themselves on Daily Journal. From detailed posts about almost every apple variety you could ever imagine to a blog dedicated to the art of blogging itself, the ability to easily share, publish and express oneself on the web is at the core of Daily Journal's mission. As the web constantly evolves, we want to ensure anyone using Daily Journal has an easy and intuitive experience publishing their content to the web.";
const contactContent = " message to convey, just say it anyway and we shall respond accordingly. Send DM";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var posts = []; //----array for all posts

// ---------Post Request-----------
app.get("/", function (req, res) {  
  res.render("home", {content : homeStartingContent, allPosts : posts});
});

app.get("/contact", function (req, res) {  
  res.render("contact", {content : contactContent});
});

app.get("/about", function (req, res) {  
  res.render("about", {content : aboutContent});
});

app.get("/compose", function (req, res) {  
  res.render("compose");
});

app.get("/posts/:topic", function(req, res){
  var found = 0;
  var topic = req.params.topic;
  posts.forEach(function(post){
    if(lodash.lowerCase(post.title) === lodash.lowerCase(topic) ){
      found = 1;
      res.render("post", {post : post});
    }
  })
  if(found){
    print("Match found!");
  }
  else{
    print("Match Not found!");
  }
});

// ----Post Request-----------
app.post("/", function (req, res) {
  res.render("home", {allPosts : posts});
});

app.post("/compose", function (req, res) {
  const post = {
    title : req.body.postTitle,
    content : req.body.postBody
  };
  // var temp1 = '<span id="dots">...</span><span id="more">';
  // var temp2 = "</span>";
  // post.content = [post.content.slice(0,60), temp1 , post.content.slice(60), temp2].join("");
  posts.push(post);
  res.redirect("/");
});






app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
