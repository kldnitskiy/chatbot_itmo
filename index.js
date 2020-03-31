const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const server = express()
const PORT = process.env.PORT || 80

server.listen(PORT)
//BOT SETUP
const bot = new Botact({
    token: '91c66aec637d3f1ea0615132ea568793ffc55b18c0dd878c386584ee226bf7264f669f30cc61986c8e3e2',
    confirmation: 'f5f07863'
})
//SERVER SETUP
server.use(bodyParser.json())
server.post('/', bot.listen)
server.get('/', (request, response) => {
    request.header('Content-Type', 'application/json')
    response.send('f5f07863')
})
//MYSQL SETUP
let con = mysql.createConnection({
  host: "us-cdbr-iron-east-01.cleardb.net",
  user: "b09805f711cdac",
  password: "c362ba82",
database: "heroku_2cf38b0299dd81c"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MYSQL!");
});

function insert_vk_id(vk_id){
  let sql = "INSERT INTO chatbot_data (vk_id) VALUES ("+vk_id+")";
    let check_user = "SELECT vk_id FROM chatbot_data WHERE vk_id = "+vk_id+" ";
  con.query(check_user, function (err, result) {
    if (err) throw err;
      if(typeof(result) === 'object' && Object.keys(result).length === 0){
          con.query(sql, function (err, result) {
    if (err) throw err;
              console.log('Inserted new vk_id');
              con.end(function(err) {
  // The connection is terminated now
});
  }); 
      }
  });  
    
}


//BOT REPLIES
bot.on(function (user_message){
    insert_vk_id(user_message.user_id)
    user_message.reply('Привет')
})

//BOT BASIC EVENTS
let group_join_msg = 'Добро пожаловать в семью!Ты сделал маленький, но весомый шаг к незабываемой студенческой жизни♥Это особенное место с неповторимыми людьми✨ А ты уже - наша часть 😌Мы обещаем, будет интересно 😏 ';
bot.event('group_join', ({ reply }) => {
  reply(group_join_msg)
})






//mysql://b09805f711cdac:c362ba82@us-cdbr-iron-east-01.cleardb.net/heroku_2cf38b0299dd81c?reconnect=true