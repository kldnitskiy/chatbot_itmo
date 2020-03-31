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
//let con = mysql.createConnection({
//  host: "us-cdbr-iron-east-01.cleardb.net",
//  user: "b09805f711cdac",
//  password: "c362ba82",
//database: "heroku_2cf38b0299dd81c"
//});
//
//con.connect(function(err) {
//  if (err) throw err;
//  console.log("Connected to MYSQL!");
//});

//Вставить id человека
//function insert_vk_id(vk_id){
//  let sql = "INSERT INTO chatbot_data (vk_id) VALUES ("+vk_id+")";
//    let check_user = "SELECT vk_id FROM chatbot_data WHERE vk_id = "+vk_id+" ";
//  con.query(check_user, function (err, result) {
//    if (err) throw err;
//      if(typeof(result) === 'object' && Object.keys(result).length === 0){
//          con.query(sql, function (err, result) {
//    if (err) throw err;
//              console.log('Inserted new vk_id');
//              con.end(function(err) {});
//  }); 
//      }
//  });  
//    
//}
var pool  = mysql.createPool({
host: "us-cdbr-iron-east-01.cleardb.net",
user: "b09805f711cdac",
password: "c362ba82",
database: "heroku_2cf38b0299dd81c"
});

//getUsers
getUsers = function(callback) {
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
    let sql = "SELECT vk_id FROM chatbot_data";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
        //return results;
      callback(false, results);
    });
  });
};
getPair = function(callback, id) {
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
    let sql = "SELECT vk_id FROM chatbot_data WHERE pair_id = "+id+"";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
        //return results;
//        console.log("Пара");
      pair = results[0].vk_id;
        //pair = results[0].vk_id;
      callback(false, results);
        
    });
  });
};
//getUnpaired
getUnPaired = function(callback) {
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
    let sql = "SELECT vk_id FROM chatbot_data WHERE pair_id = ''";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
        //return results;
      callback(false, results);
    });
  });
};
//CheckPair
CheckPair = function(callback, id, user_message) {
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
    let sql = "SELECT vk_id FROM chatbot_data WHERE vk_id = "+id+" AND pair_id !=''";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
        //return results;
      callback(false, results, user_message);
    });
  });
};
//SetPair
SetPair = function(callback, id, pair_id, user_message) {
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
      let sql = "UPDATE chatbot_data SET pair_id = (case when vk_id = "+id+" then  "+pair_id+" when vk_id =  "+pair_id+" then  "+id+" end)";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
        //return results;
      callback(false, results, id);
    });
  });
};

let users = getUsers(saveUsers);
function saveUsers(status, result){
    users = result;
    console.log('Все пользователи: ' + users);
}
let pair;
function savePair(status, result){
//console.log(result);
    //pair = result[0].vk_id;
}
let unpaired = getUnPaired(saveUnpaired);
function saveUnpaired(status, result){
    unpaired = result;
    console.log('Без пары: ' + unpaired);
}
function savePaired(status, result,id){
   bot.reply(id, 'Собеседник найден! Устанавливаем соединение...');     // Promise with response/error : Promise<any> 
}
function checkifUnpaired(status, result, user_message){
    //DETECT PAIR
    //console.log(result);
    if(Object.keys(result).length === 0){
        isUnpaired = true;
        //Bot action
        let paid_id;
        user_message.reply('Вижу, вам пока не был назначен собеседник. Начинаю поиск пары...');
        for(let i = 0; i < unpaired.length; i++){
            if(unpaired[i].vk_id !== user_message.user_id){
                pair_id = unpaired[i].vk_id;
                delete unpaired[i];
                break;
            }
        }
        SetPair(savePaired, user_message.user_id, pair_id, savePaired);
    }else{
        isUnpaired = false;
        //Bot action
        bot.reply(pair, user_message);
    }
}
//BOT REPLIES
    bot.on(function (user_message){
    let pair = getPair(savePair, user_message.user_id);
    let isUnpaired = CheckPair(checkifUnpaired, user_message.user_id,user_message); 
})
//BOT BASIC EVENTS
let group_join_msg = 'Добро пожаловать в семью!Ты сделал маленький, но весомый шаг к незабываемой студенческой жизни♥Это особенное место с неповторимыми людьми✨ А ты уже - наша часть 😌Мы обещаем, будет интересно 😏 ';
bot.event('group_join', ({ reply }) => {
  reply(group_join_msg)
})






//mysql://b09805f711cdac:c362ba82@us-cdbr-iron-east-01.cleardb.net/heroku_2cf38b0299dd81c?reconnect=true