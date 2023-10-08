//jshint esversion:6

import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";

// database
mongoose
  .connect(
    "mongodb+srv://pritam1:pritam123@cluster0.45zeamf.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected!"));
///////////////////////

const port = process.env.PORT || 3000;
const app = express();
///////////schemas
const Schema = mongoose.Schema;
const BlogPost = new Schema({
  title: String,
  post: String,
  date: Date,
});

const blogData = mongoose.model("blogData", BlogPost);

// defult data
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const updatedPost = await blogData.find();
app.get("/", async (req, res) => {
  const updatedPost = await blogData.find();
  console.log(updatedPost, "<-noothing");
  res.render("home.ejs", { postData: updatedPost });
});

//compose the post request
app.get("/compose", async (req, res) => {
  res.render("compose.ejs");
});

//taking data from from of compose
app.post("/post", async (req, res) => {
  const title = req.body.title;
  const post = req.body.post;
  //check if title,post exists or not
  const isEmptyOrSpaces = (str) => {
    return str === null || str.match(/^ *$/) !== null;
  };

  if (isEmptyOrSpaces(title) || isEmptyOrSpaces(post)) {
    res.send("No data provided. Please enter a valid title and post.");
  } else {
    try {
      const newPost = await blogData.insertMany({
        title: title,
        post: post,
        date: new Date(),
      });
      const updatedPost = await blogData.find();
      res.render("home.ejs", { postData: updatedPost }); // Specify the correct template file (e.g., "home.ejs")
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).send("Internal Server Error");
    }
  }
});

// listen to the port
app.listen(port, function () {
  console.log("Server started on port 3000");
});
