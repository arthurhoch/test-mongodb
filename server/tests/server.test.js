const expect = require('expect')
const request = require('supertest')
const { ObjectId } = require('mongodb')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')
const { User } = require('./../models/user')

const { populateTodos, todos, populateUsers, users } = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text'

		request(app)
		.post('/todos')
		.send({text})
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toBe(text)
		})
		.end((err, res) => {
			if (err) {
				return done(err)
			}

			Todo.find({text}).then((todos) => {
				expect(todos.length).toBe(1)
				expect(todos[0].text).toBe(text)
				done();
			}).catch((e) => done(e))

		})
	})

	it('should not create todo with invalid body data', (done) => {
		request(app)
		.post('/todos')
		.send({})
		.expect(400)
		.end((err, res) => {
			if (err) {
				return done(err)
			}

			Todo.find().then((todos) => {
				expect(todos.length).toBe(2)
				done()
			}).catch((e) => done(e))
		})
	})
})

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
		.get('/todos')
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(2)
		})
		.end(done)
	})
})

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(todos[0].text)
		})
		.end(done)
	})

	it('should return 404 if todo not found', (done) => {
		var hexId = new ObjectId().toHexString();

		request(app)
		.get(`/todos/${hexId}`)
		.expect(404)
		.end(done)
	})

	it('sould return 404 for non-object ids', (done) => {
		request(app)
		.get('/todos/123')
		.expect(404)
		.end(done)
	})

})

describe('DELETE /todos/:id', () => {	

	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString()

		request(app)
		.delete(`/todos/${hexId}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo._id).toBe(hexId)
		})
		.end((err, res) => {
			if (err) {
				return done(err)
			}

			Todo.findById(hexId).then((todo) => {
				expect(todo).toNotExist()
				done()
			}).catch((e) => done(e))

		})
	})

	it('should return 404 if todo not found', (done) => {
		var hexId = new ObjectId()
		request(app)
		.delete(`/todos/${hexId}`)
		.expect(404)
		.end(done)
	})

	it('should return 404 id a object id is invalid', (done) => {
		request(app)
		.delete('/todos/123')
		.expect(404)
		.end(done)
	})
})

describe('PATCH /todos/:id', () => {
	
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString()

		var objectUpdate = {
			text: "New text",
			completed: true
		}

		request(app)
		.patch(`/todos/${hexId}`)
		.send(objectUpdate)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(objectUpdate.text)
		}).end((err, res) => {
			if (err) {
				return done(err)
			}

			Todo.findById(hexId).then((todo) => {
				expect(todo.completed).toBe(true)
				expect(todo.completedAt).toBeA('number')
				done()
			}).catch((e) => done(e))

		})

	})

	it('should clear completedAt when todo is not completed', (done) => {
		var hexId = todos[1]._id.toHexString()

		var objectUpdate = {
			text: "New text",
			completed: false 
		}

		request(app)
		.patch(`/todos/${hexId}`)
		.send(objectUpdate)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(objectUpdate.text)
		}).end((err, res) => {
			if (err) {
				return done(err)
			}

			Todo.findById(hexId).then((todo) => {
				expect(todo.completed).toBe(false)
				expect(todo.completedAt).toNotExist()
				done()
			}).catch((e) => done(e))

		})

	})

}) 

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {

		users

		request(app)
		.get('/users/me')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body._id).toBe(users[0]._id.toHexString())
			expect(res.body.email).toBe(users[0].email)
		})
		.end(done)
	})

	it('should return 401 if not authenticated', (done) => {
		request(app)
		.get('/users/me')
		.expect(401)
		.expect((res) => {
			expect(res.body).toEqual({})
		})
		.end(done)
	})
})

describe('POST /users', () => {

	it('should creat a user', (done) => {
		var email = 'example@example.com'
		var password = '123mb!'

		request(app)
		.post('/users')
		.send({email, password})
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toExist()
			expect(res.body._id).toExist()
			expect(res.body.email).toExist()
		})
		.end((err) => {
			if (err) {
				return done(err)
			}

			User.findOne({email: email}).then((user) => {
				expect(user).toExist()
				expect(user.password).toNotBe(password)
				done()
			})

		})
	})

	it('should return validation errors if request invalid', (done) => {
		var email = 'wrong email'
		var password = '123'

		request(app)
		.post('/users')
		.send({email, password})
		.expect(400)
		.end(done)

	})

	it('sould not create usert if email in use', (done) => {
		var email =  users[0].email
		var password = '123mb!'

		request(app)
		.post('/users')
		.send({email, password})
		.expect(400)
		.end((err) => {
			if (err) {
				done(err)
			}

			done()

		})
	})


})

