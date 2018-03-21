const expect = require('expect');
const request = require('supertest');

const app = require('./../server').app;
const Todo = require('./../models/todo').Todo;
const ObjectID = require('mongodb').ObjectID;

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

beforeEach(function(done) {
  Todo.remove({}).then(function() {
    return Todo.insertMany(todos);
  }).then(function() {
    done();
  });
});

describe('POST /todos', function() {
  it('should create a new todo', function(done) { 
    var text = 'Test todo post 1';

    request(app)
      .post('/todos')
      .send({
        text: text
      })
      .expect(200)
      .expect(function(res) {
        expect(res.body.text).toBe(text);
      })
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        Todo.find().then(function(todos) {
          expect(todos.length).toBe(3);
          expect(todos[2].text).toBe(text);
          done();
        }).catch(function(err) {
          done(err);
        });

      });
  });

  it('should not create todo with invalid body data', function(done) {
    var text = '';

    request(app)
      .post('/todos')
      .send({
        text: text
      })
      .expect(400)
      .end(function(err, res) {
        if (err) {
          return done(err)
        }

        Todo.find().then(function(todos) {
          expect(todos.length).toBe(2);
          done();
        }).catch(function(err) {
          done(err);
        });
      });
  });
});

describe('GET /todos', function() {
  it('should get all todos', function(done) {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(function(res) {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', function() {
  it('should return a todo', function(done) {
    request(app)
      .get('/todos/' + todos[0]._id.toHexString())
      .expect(200)
      .expect(function(res) {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', function (done) {
    notFoundId = new ObjectID().toHexString();
    request(app)
      .get('/todos/' + notFoundId)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', function (done) {
    var invalidId = '1234';
    request(app)
      .get('/todos/' + invalidId)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', function() {
  it('should remove a todo', function(done) {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .delete('/todos/' + hexId)
      .expect(200)
      .expect(function(res) {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(function (err, res) {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then(function (todo) {
          expect(todo).toBeNull();
          done();
        }).catch(function (e) {
          done(e);
        });
      });
  });

  it('should return 404 if todo not found', function (done) {
    notFoundId = new ObjectID().toHexString();
    request(app)
      .delete('/todos/' + notFoundId)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', function (done) {
    var invalidId = '1234';
    request(app)
      .delete('/todos/' + invalidId)
      .expect(404)
      .end(done);
  });
});