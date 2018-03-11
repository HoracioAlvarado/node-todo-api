const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;



MongoClient.connect('mongodb://localhost:27017/TodoApp', function(err, client) {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  /*db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then(function (result) {
    console.log(result);
  })*/

  /*db.collection('Todos').deleteOne({text: 'Something to do'}).then(function (result) {
    console.log(result);
  })*/

  /*db.collection('Todos').findOneAndDelete({completed: false}).then(function (result) {
    console.log(result);
  })*/

  // Excercise
  db.collection('Users').deleteMany({name: 'Horacio'}).then(function (result) {
    console.log(result);
  })

  db.collection('Users').findOneAndDelete({_id: new ObjectID('5aa57f014b43706e87c77e71')}).then(function (result) {
    console.log(result);
  })  
  // client.close();
});