const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true,  useUnifiedTopology: true  });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// //////////////////////////////////// Main article ///////////////////////////////////

app.route("/articles")

//  get

.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
        
    });
})

//  post

.post(function(req, res){

    const newArticle = new Article({
        title : req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Succesfully added");
        }else{
            res.send(err);
        }
    });
   
})

//  delete

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted");
        }else{
            res.send(err);
        }
    });
});

// //////////////////////////////////// Sub article ///////////////////////////////////

app.route("/articles/:articleTitle")

//  get

.get(function(req, res){

    Article.findOne({title : req.params.articleTitle}, function(err , foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No article found");
        }
    });
})

//  put

.put(function(req, res){
    Article.update(
        {title : req.params.articleTitle},
        {title : req.body.title, content : req.body.content},
        {overwrite : true},
        function(err){
            if(!err){
                res.send("Succesfully updated");
            }
        }
    );
})

// patch

.patch(function(req, res){
    Article.update(
        {title: req.param.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Succesfully updated");
            }
        }
    );
})

//  delete

.delete(function(req, res){
    Article.deleteOne(
        {title: req.param.articleTitle},
        function(err){
        if(!err){
            res.send("Successfully deleted");
        }else{
            res.send(err);
        }
    });
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});





// "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --dbpath="c:\data\db"

// "C:\Program Files\MongoDB\Server\4.4\bin\mongo.exe"

// http://api.openweathermap.org/data/2.5/weather?q=Karjat&appid=9216e05e696f5cff415d1e822382ca06&units=metric