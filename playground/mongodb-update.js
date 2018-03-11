const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;



MongoClient.connect('mongodb://localhost:27017/TodoApp', function(err, client) {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  /*db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5aa58781a01d398a08638f18')
  }, {
    $set: {
      completed: false
    }
  }, {
    returnOriginal: false
  }).then(function (result) {
    console.log(result);
  });*/

  db.collection('Users').findOneAndUpdate({
    name: 'Mike'
  }, {
    $set: {
      name: 'Horacio'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then(function (result) {
    console.log(result);
  });

  // client.close();
});