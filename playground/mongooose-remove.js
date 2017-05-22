const { ObjectID } = require('mongodb')
const { mongoose } = require('../server/db/mongoose')
const { Todo } = require('../server/models/todo')
const { User} = require('../server/models/user')

 // Todo.remove({}).then((result) => {
 // 	console.log(result)
 // })

var id = new ObjectID().toHexString()

Todo.findOneAndRemove(id).then((todo) => {
	
})

Todo.findByIdAndRemove(id).then((todo) => {
	console.log(todo)
})



