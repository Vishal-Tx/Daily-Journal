require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const mongoose = require("mongoose");
const methodOverride = require('method-override')
const port = process.env.PORT || 3000;



const _ = require('lodash');

//for jquery
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);
//


app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))

app.set("view engine", "ejs")

// const posts=[];
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/posts";
mongoose.connect(dbUrl);

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 1
  },
  content: { type: String, required: 1 },
});

const Post = mongoose.model("Post", postSchema)


const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.get("/", (req,res)=>{


    Post.find((err, posts) => {
      if (err) {
        console.log("Something went wrong");
      } else {
        res.render("home", {posts});
      }
    });
    
    
    

})

app.get("/about", (req,res)=>{
    res.render("about", {abourPara:aboutContent})

})

app.get("/contact", (req,res)=>{
    res.render("contact", {contactPara:contactContent})

})

app.get("/compose", (req,res)=>{
    res.render("compose")

})

app.get(`/posts/:inputURL`, (req, res) => {
  const postURL = _.lowerCase(req.params.inputURL);

  Post.find((err, posts) => {
    if (err) {
      console.log("Something went wrong.");
    } else {
      posts.forEach((post) => {
        const postTitle = _.lowerCase(post.title);
        const postContent = post.content;

        if (postURL === postTitle ) {
          console.log("Match found", post);
          res.render("indiPage", {
            postId: post._id,
            postTitle: post.title,
            postContent: postContent,
          });
        } else {
          console.log("Different");
        }
      });
    }
  });
});

app.delete(`/posts/:inputURL`, async(req, res)=>{
  await Post.deleteOne({ title: req.params.inputURL });
  res.redirect("/")

})

app.post("/compose", (req, res) => {
  var post = new Post({
    title: req.body.userInputTitle,
    content: req.body.userInputPost,
  });


    post.save();
    res.redirect("/");



    
  
  

//   Post.find((err, posts) => {
//       console.log(posts);
//     if (err) {
//       console.log("Something wrong");
//     } else {
//       posts.forEach((poste) => {
//         if (poste.title === req.body.userInputTitle) {
//           console.log("Title already in use");
//           res.redirect("/compose")
//         } else {
          
//         }
//       });
//     }
//   });
});

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})



// db.products.insertOne({
//     _id:3,
//     name:"Rubber",
//     price:1.30,
//     stock: 43,
//     reviews:[
//         {
//             authorName: "Ramiks Sen",
//             rating: 4,
//             review: "Amazing Product"

//         },
//         {
//             authorName: "Sam Dangal",
//             rating: 5,
//             review: "Mja aaya"
//         }
//     ]
// })



// db.products.update({
//     _id:3
// },
//     {$unset: {'reviews.$[].review': 1}},
//     {multi: true}
//   )

//   db.products.update({
//     _id:3, 'reviews.authorName': "Ramiks Sen" 
// },
//     {$set: {'reviews.$[].review': "Amazing Product"}}
//   )

//   db.products.updateOne({
//     _id:3, 'reviews.authorName': "Sam Dangal" 
// },
//     {$set: {'reviews.$[].review': "Good stuff"}}
//   )

//   db.products.updateOne(
//     { _id:3, 'reviews.authorName':"Ramiks Sen"},
//     { $set: { "reviews.$.review" : "Amazing Product" } }
//  )

//  db.products.updateOne(
//     { _id:3, 'reviews.authorName':"Ramiks Sen"},
//     { $set: { "reviews.$.authorName" : "Ramika Sen" } }
//  )
//  db.products.updateOne(
//     { _id:3, 'reviews.authorName':"Ramiks Sen"},
//     { $unset: { "reviews.$.authorNAme" : "Ramika Sen" } }
//  )

// db.products.updateOne({_id:1},{
//     $set:{reviews:[
//         {
//             authorName:"Seth morgan",
//             rating: 3,
//             review:"Definitely Good"
//         },
//         {
//             authorName:"Angel Dips",
//             rating: 4,
//             review:"Works flawlessly"

//         }
//     ]}
// })

// db.products.updateOne({_id:2},{
//     $unset:{reviews:""}
// })