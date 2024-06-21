// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/comments');

var db = mongoose.connection;

// Added check for DB connection
if (!db)
  console.log("Error connecting db")
else
  console.log("Db connected successfully")

// Define Schema
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  name: String,
  comment: String
}, {
  versionKey: false
});

// Define Model
var model = mongoose.model('comment', commentSchema, 'comments');

// Create GET REST endpoint
app.get('/comments', function(req, res) {
  model.find({}, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

// Create POST REST endpoint
app.post('/comments', function(req, res) {
  var newComment = new model(req.body);
  newComment.save(function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send({
        message: "Comment successfully added",
        data: data
      });
    }
  });
});

// Create PUT REST endpoint
app.put('/comments/:id', function(req, res) {
  model.findByIdAndUpdate(req.params.id, req.body, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send({
        message: "Comment successfully updated",
        data: data
      });
    }
  });
});

// Create DELETE REST endpoint
app.delete('/comments/:id', function(req, res) {
  model.findByIdAndRemove(req.params.id, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send({
        message: "Comment successfully deleted",
        data: data
      });
    }
  });
});

// Create server
var server = app.listen(8000, function() {
  console.log('Server is running..');
});