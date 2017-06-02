const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')

const { Todo } = require('./../../models/todo') 
const { User } = require('./../../models/user')

const userOneId = new ObjectId()
const userTwoId = new ObjectId()

const users = [{
	_id: userOneId,
	email: 'teste@teste.com',
	password: 'senhadificil', 
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, acess: 'auth'}, 'abc123').toString()
	}]
	}, {
		_id: userTwoId,
		email: 'teste2@teste.com',
		password: 'ultradificil'
}]



const todos = [{
	_id: new ObjectId(),
	text: 'First test todo'
	}, {
	_id: new ObjectId(),
	text: 'Second test todo',
	completed: true,
	completedAt: 333
}]

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos)
	}).then(() => done())
}

const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save()
		var userTwo = new User(users[1]).save()

		return Promise.all([userOne, userTwo])
	}).then(() => done())
	.catch((e) => done())
}

module.exports = {
	todos,
	populateTodos,
	users,
	populateUsers
}