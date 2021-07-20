//jshint esversion:6

// RESTful Wiki API
// 
//  HTTP Verbs    /article                  /articles/jack-bauer
//  GET           Fetches all the articles  Fetches the article on jack-bauer
//  POST          Creates one new article    -
//  PUT            -                        Updates the article on jack-bauer
//  PATCH          -                        Updates the article on jack-bauer
//  DELETE        Deletes all the articles  Deletes the article on jack-bauer

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

// create new instance of express
const app = express();

// use ejs as templating engine
app.set('view engine', 'ejs');

// use body-parser to parse requests
app.use(bodyParser.urlencoded({
  extended: true
}));
// use public folder to store static files such as images, css
app.use(express.static("public"));

//set up MongoDB, use new Url Parser to get rid of errors that mongoDB likes to throw
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});
const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req,res){
  // find({condition}, callbackfunction(req,res)) no condition = get all
  Article.find(function(err, foundArticles){
    if (!err){
      // returns all articles in json format
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})
.post(function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    }else{
      res.send(err);
    }
  });
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all articles.");
    }else{
      res.send(err);
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});