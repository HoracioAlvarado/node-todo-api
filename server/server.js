var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('./db/mongoose');
var Todo = require('./models/todo').Todo;
var User = require('./models/user').User;

var app = express();

app.use(bodyParser.json());

app.post('/todos', function(req, res) {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then(function(doc) {
    res.send(doc);
  }, function(err) {
    res.status(400).send(err);
  });
  console.log(req.body);
});

app.get('/todos', function(req, res) {
  Todo.find().then(function(todos) {
    res.send({
      todos: todos
    });
  }, function(err) {
    res.status(400).send(err);
  })
})



app.listen(3000, function() {
  console.log('Started on port 3000');
})

module.exports = {
  app: app
};