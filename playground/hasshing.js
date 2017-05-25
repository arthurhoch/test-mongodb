const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')

var data = {
	id: 10
}

var token = jwt.sing(data, '123') 
console.log(token)

var decode = jwt.verify(token, '123')
console.log('decode', decode)

// var message = 'I am user number 3'
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)


// var data = {
// 	id: 4
// }

// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // token.data.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString()

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()

// if (resultHash == token.hash) {
// 	console.log('Data was ont changed')
// } else	{
// 	console.log('Data was changed')
// }