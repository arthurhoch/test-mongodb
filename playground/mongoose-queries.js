const { ObjectID } = require('mongodb')
const { mongoose } = require('../server/db/mongoose')
const { Todo } = require('../server/models/todo')
const { User} = require('../server/models/user')

	
// var id = '5923034f386e44071b4f529b11';

// if (!ObjectID.isValid(id)) {
// 	console.log('ID not valid')
// }

// Todo.find({
// 	_id: id
// }).then((todos) =>{
// 	console.log('Todos', todos)
// })

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todo', todo)
// })

// Todo.findById(id).then((todo) => {
// 	if (!todo) {
// 		return console.log('Id not found')
// 	}
// 	console.log('TodoById', todo)
// }).catch((e) => console.log(e))

var user_id = '591fbf7ea74a6673569acce3';

User.findById(user_id).then((user) => {
	if (!user) {
		return console.log('Unable to find user')
	}
	console.log(JSON.stringify(user, undefined, 2))
}).catch((e) => {
	console.log(e)
})