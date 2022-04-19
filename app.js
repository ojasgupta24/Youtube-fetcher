const express = require("express");
const https = require("https");
const mongoose = require("mongoose");
const axios = require('axios');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

//create videoDB database in mongoose-------------------------
mongoose.connect("mongodb://localhost:27017/videoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//-----------------------------------------------------------

//model structure for video object---------------------------
const videoSchema = new mongoose.Schema({
  videoTitle: String,
  description: String,
  DateTime: String,
  ThumbnailURL: String,
});
const Video = mongoose.model("Video", videoSchema);
//-----------------------------------------------------------

//url for youtube api call------------------------------------
const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=date&publishedAfter=2020-01-01T00:00:00Z&key=<your api key>&q=";
//-----------------------------------------------------------

//function to store/save data into database------------------
let addToDatabse = (data) => {
  let videoArr = data.data.items;
  videoArr.forEach((vid) => {
    const video = new Video({
      videoTitle: vid.snippet.title,
      description: vid.snippet.description,
      DateTime: vid.snippet.publishedAt,
      ThumbnailURL: vid.snippet.thumbnails.default.url,
    })
    video.save();
  })
}
//-----------------------------------------------------------

//function to start recursive calls on youtube api (interval = 10sec)------------
let recursiveCalls = (title, des) => {
  setInterval(async () => {
    try {
      const res = await axios.get(url + title + "|" + des);
      console.log(res);
      addToDatabse(res);
    } catch (err) {
      console.error(err);
    }
  }, 10000);
}
//-------------------------------------------------------------------------------

//function to get data if database has 0 result on query -----------------------
let youtube = async (title, des) => {
  try {
    const res = await axios.get(url + title + "|" + des);
    addToDatabse(res);
    let data = [];
    let cnt = 0;
    for (const vid of res.data.items) {
      if(cnt > 9) break;
        let obj ={
        videoTitle: vid.snippet.title,
        description: vid.snippet.description,
        DateTime: vid.snippet.publishedAt,
        ThumbnailURL: vid.snippet.thumbnails.default.url,
      };
      data.push(obj);
      ++cnt;
    }
    return data;
  } catch (err) {
    // Handle Error Here
    console.error(err);
    return [];
  }
}
//------------------------------------------------------------------------------

//get api request to send result with pagination -------------------------------
app.post("/", async function(req, res) {
  let title = req.query.title;
  let des = req.query.description;
  let page = req.query.page ? req.query.page : 1;
  //trying to get result from databse on given title or des---------------------
  try {
    let videos = await Video.find({
      $or: [{
        'videoTitle': {
          $regex: '^' + title,
          $options: 'i'
        }
      }, {
        'description': {
          $regex: '^' + des,
          $options: 'i'
        }
      }]
    }).skip((page - 1) * 10).limit(10);
    //start of recursive youtube api call on given query--------------------------
    recursiveCalls(title, des);
    //if we get data from database send back to postman or frontend---------------
    if (videos.length > 0) res.send(videos);
    //else call youtube function to fetch data on given for the first time--------
    else res.send(await youtube(title, des));
  } catch (err) {
    res.status(400).json({
      message: "Sorry for your inconvenience"
    });
  }
})
//------------------------------------------------------------------------------

app.listen(3000, function() {
  console.log("server running on port 3000");
});
