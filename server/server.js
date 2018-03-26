require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcryptjs');

var mongoose = require('./db/mongoose');
var Todo = require('./models/todo').Todo;
var User = require('./models/user').User;
var app = express();
var authenticate = require('./middleware/authenticate').authenticate;

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
  });
});

app.get('/todos/:id', function (req, res) {
  
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    // console.error('ID not valid');
    return res.status(404).send();
  }
  
  Todo.findById(id).then(function (todo) {
    if (!todo) {
      return res.status(404).send();
    }

    return res.send({todo: todo}).status(200);

  }).catch(function (err) {
    return res.status(400).send();
  });
});

app.delete('/todos/:id', function (req, res) {
  var idToDelete = req.params.id;

  if (!ObjectID.isValid(idToDelete)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(idToDelete).then(function (todo) {
    if (!todo)
      return res.status(404).send();
    else
      return res.status(200).send({todo: todo});
  }).catch(function (err) {
    return res.status(400).send();
  })
});

app.patch('/todos/:id', function (req, res) {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(function (todo) {
    if (!todo) {
      return res.status(404).send();
    }

    res.status(200).send({todo: todo});
  }).catch(function (e) {
    res.status(400).send();
  });
})

app.post('/users', function(req, res) {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(function() {
    return user.generateAuthToken();
  }).then(function (token) {
    res.header('x-auth', token).send(user);
  }).catch(function (err) {
    res.status(400).send('Error: ' + err);
  });
  console.log(req.body);
});

app.get('/users/me', authenticate, function (req, res) {
    res.send(req.user);
});

app.post('/users/login', function (req, res) {
  var body = _.pick(req.body, ['email', 'password']);
  
  User.findByCredentials(body.email, body.password).then(function (user) {
    return user.generateAuthToken().then(function (token) {
      res.header('x-auth', token).send(user);
    })
  }).catch(function (e) {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, function (req, res) {
  req.user.removeToken(req.token).then(function () {
    res.status(200).send();
  }, function (e) {
    res.status(400).send();
  });
});

app.listen(3000, function() {
  console.log('Started on port 3000');
});

module.exports = {
  app: app
};