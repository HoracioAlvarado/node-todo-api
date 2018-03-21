const ObjectID = require('mongodb').ObjectID;

const mongoose = require('./../server/db/mongoose.js').mongoose;
const Todo = require('./../server/models/todo.js').Todo;
const User = require('./../server/models/user.js').User;

var id = 'aa5aa5bfbebaf9085d8f5d0926';


/*if (!ObjectID.isValid(id)) {
    console.error('ID not valid');
}*/
    
/*Todo.find({
    _id: id
}).then(function (todos) {
    console.log('Todos', todos);
});*/

/*Todo.findOne({
   _id: id
}).then(function (todo) {
    console.log('Todo', todo); 
});*/

/*Todo.findById(id).then(function (todo) {
    if (!todo) {
        return console.log('Id not found');
    }
    console.log('Todo By Id', todo);
}).catch(function (e) {
    console.log(e);
});*/

var idUser = '5aa5a5823e7d58652f350ac5';

User.findById(idUser).then(function (user) {
    if (!user) {
        return console.log('Id not found');
    }
    console.log('User By Id', user);
}, function (e) {
    console.log(e);
});