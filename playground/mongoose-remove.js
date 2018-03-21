const ObjectID = require('mongodb').ObjectID;

const mongoose = require('./../server/db/mongoose.js').mongoose;
const Todo = require('./../server/models/todo.js').Todo;
const User = require('./../server/models/user.js').User;


//Remove all objects
/*Todo.remove({}).then(function (result) {
    console.log(result);
});*/


Todo.findByIdAndRemove('5ab1c65c86fe215abb9415a1').then(function (todo) {
    console.log(todo);
});