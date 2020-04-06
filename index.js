//MODULES
const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const server = express()
const PORT = process.env.PORT || 80
const api = require('./api')
const callback = require('./callback')

//BOT SETUP
const bot = new Botact({
    token: '91c66aec637d3f1ea0615132ea568793ffc55b18c0dd878c386584ee226bf7264f669f30cc61986c8e3e2',
    confirmation: '9ebed8d2'
})

//SERVER SETUP
server.use(bodyParser.json())
server.post('/', bot.listen)
server.get('/', (request, response) => {
    request.header('Content-Type', 'application/json')
    response.send('f5f07863')
})
server.listen(PORT)


//MYSQL SETUP
let pool  = mysql.createPool({
   host     : "localhost",
   user     : "root",
   password : "1812danil",
   database : "chatbot_itmo"
});
let users_data = {
"users":[
  {"id":"John", "pair_id":"Doe", "status": ""},
]
}
console.log('running')

bot.on(function (res){
    console.log(users_data[0].users.id)
    console.log(res.user_id + ' Написал: ' + res.body)
    //Убираем клавиатуру
})
