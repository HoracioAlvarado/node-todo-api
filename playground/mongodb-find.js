const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;



MongoClient.connect('mongodb://localhost:27017/TodoApp', function(err, client) {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  /*db.collection('Todos').find({
    _id: new ObjectID('5aa58260bcb24076c4eee44f')
  }).toArray().then(function (docs) {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined,2));
  }, function (error) {
    console.log('Unable to fetch todos', err);
  });*/

  db.collection('Users').find({name: 'Horacio'}).toArray().then(function (docs) {
    console.log('Users');
    console.log(JSON.stringify(docs, undefined, 2));
  }, function (error) {
    console.log('Unable to fetch todos', err);
  });

  // client.close();
});