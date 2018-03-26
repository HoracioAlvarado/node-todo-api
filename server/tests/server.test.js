const expect = require('expect');
const request = require('supertest');
const ObjectID = require('mongodb').ObjectID;

const app = require('./../server').app;
const Todo = require('./../models/todo').Todo;
const User = require('./../models/user').User;
const todos = require('./seed/seed').todos;
const users = require('./seed/seed').users;
const populateTodos = require('./seed/seed').populateTodos;
const populateUsers = require('./seed/seed').populateUsers;


beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todos/:id', function() {
  it('should update a todo', function(done) {
    var hexId = todos[0]._id.toHexString();
    var text = 'New Text';

    request(app)
      .patch('/todos/' + hexId)
      .send({
        completed: true,
        text: text
      })
      .expect(200)
      .expect(function(res) {
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
        expect(res.body.todo.text).toBe(text);
      })
      .end(done);
  });

  it('should clear completeAt when todo is not completed', function (done) {
    var hexId = todos[1]._id.toHexString();
    var text = 'New Text!!';

    request(app)
      .patch('/todos/' + hexId)
      .send({
        completed: false,
        text: text
      })
      .expect(200)
      .expect(function(res) {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
        expect(res.body.todo.text).toBe(text);
      })
      .end(done);
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

describe('GET /users/me', function () {
  it('should return user if authenticated', function (done) {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(function (res) {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', function (done) {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(function (res) {
        expect(res.body).toEqual({});
      })
      .end(done);
  })
});

describe('POST /users', function () {
  it('should create a user', function (done) {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({
        email: email,
        password: password
      })
      .expect(200)
      .expect(function (res) {
        expect(res.headers['x-auth']).toBeDefined();
        expect(res.body._id).toBeDefined();
        expect(res.body.email).toBe(email);
      })
      .end(function (err) {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then(function (user) {
          expect(user).toBeDefined;
          expect(user.password).not.toBe(password);
          done();
        })
      });
  });

  it('should return validation errors if request invalid', function (done) {
    var email = 'invalid';
    var password = '126';

    request(app)
      .post('/users')
      .send({
        email: email,
        password: password
      })
      .expect(400)
      .end(done);
      
  });

  it('should not create user if email in use', function (done) {
    var email = 'test@example.com';
    var password = '126123';

    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: password
      })
      .expect(400)
      .end(done);
  })
})