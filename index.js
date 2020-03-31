const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const server = express()
const PORT = process.env.PORT || 80
const bot = new Botact({
    token: '91c66aec637d3f1ea0615132ea568793ffc55b18c0dd878c386584ee226bf7264f669f30cc61986c8e3e2',
    confirmation: 'f5f07863'
})

bot.on(function (user_message){
    console.log(user_message.user_id)
    user_message.reply('Привет')
})
bot.event('group_join', ({ reply }) => {
  reply('Добро пожаловать в семью!Ты сделал маленький, но весомый шаг к незабываемой студенческой жизни♥Это особенное место с неповторимыми людьми✨ А ты уже - наша часть 😌Мы обещаем, будет интересно 😏 ')
})
server.use(bodyParser.json())

server.post('/', bot.listen)

server.get('/', (request, response) => {
    request.header('Content-Type', 'application/json')
    response.send('f5f07863')
})
server.listen(PORT)

let con = mysql.createConnection({
  host: "us-cdbr-iron-east-01.cleardb.net",
  user: "b09805f711cdac",
  password: "c362ba82",
database: "heroku_2cf38b0299dd81c"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

let sql = "INSERT INTO chatbot_data (vk_id, pair_id) VALUES (3, 4)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });

console.log(sql);
//mysql://b09805f711cdac:c362ba82@us-cdbr-iron-east-01.cleardb.net/heroku_2cf38b0299dd81c?reconnect=true