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


//Global vars
let user_id = 0;
let pair_id = null;
console.log('running')

bot.command('Login', (res) => {
    api.checkIfRegistered(callback.loginChat, res.user_id)
    
})
bot.command('Search', (res) => {
    api.searchFreeChat(callback.createChat, res.user_id)
    
})
bot.command('Join', (res) => {
    api.getCurrentUser(callback.joinChat, res.user_id)
    
})
bot.on(function (res){
    user_id = res.user_id;
    console.log(user_id + ' Написал: ' + res.body)
    //Убираем клавиатуру
    
    api.getCurrentUser(callback.updateUserInfo, res.user_id, res.body);
})
//Начать беседу + найти пару
/*
bot.command('start', (ctx) => {
    user_id = ctx.user_id;
    if(!chatting){
        ctx.reply('Ищем собеседника...');
    console.log("Пользователь #"+ctx.user_id+" ввёл команду start");
        loginTimer()
    //loginUser(UpdateLoginStatus);
    }else{
        ctx.reply('Бот: В данный момент вы находитесь в активном чате. Если хотите покинуть беседу, напишите команду exit');
    }
    
})
bot.command('Start', (ctx) => {
    user_id = ctx.user_id;
    if(!chatting){
        ctx.reply('Ищем собеседника...');
    console.log("Пользователь #"+ctx.user_id+" ввёл команду start");
        loginTimer()
    //loginUser(UpdateLoginStatus);
    }else{
        ctx.reply('Бот: В данный момент вы находитесь в активном чате. Если хотите покинуть беседу, напишите команду exit');
    }
    
})
function loginTimer(){
    loginUser(UpdateLoginStatus)
}
//начать беседу
bot.command('go', (ctx) => {
    user_id = ctx.user_id;
    ctx.reply('Вы подключены к чату');
    console.log("Пользователь #"+ctx.user_id+" подключился к чату с пользователем #000000");
})
//выйти из беседы
bot.command('exit', (ctx) => {
    user_id = ctx.user_id;
    ctx.reply('Завершаем сеанс...');
     
    console.log("Пользователь #"+ctx.user_id+" завершил сеанс с пользователем #000000");
    //user_id = 0;
    chatting = false;
    exitTimer()
})
bot.command('Exit', (ctx) => {
    user_id = ctx.user_id;
    ctx.reply('Завершаем сеанс...');
     
    console.log("Пользователь #"+ctx.user_id+" завершил сеанс с пользователем #000000");
    //user_id = 0;
    chatting = false;
    //closeChat()
    exitTimer()
    
})
*/

//START
function UpdateLoginStatus(status, id){
    if(Object.keys(id).length!==0){
        bot.reply(user_id, 'Выполнен вход в чат')
        startChat()
    }else{
        bot.reply(user_id, 'Вы ещё не зарегистрированы');
        regUser()
    }
}
//Начать чат
function startChat(){
    getPairbyId(UpdateCurrentPair, user_id);
}

//Закрыть чат
function closeChat(){
    noticeCloseSession()
    closeSession()
}
//Зарегать пользователя
function regUser(){
    createNewUser(InsertUser, user_id);
}

//Найти пару
function findPair(){
    getFreePairbyId(CreateChat, user_id);
}
function info(){
    getAllStats();
}

//Вся информация
getAllStats = function() {
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      return; 
    }
    let sql = "SELECT vk_id FROM chatbot_data";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        return; 
      }
        
        for(let i = 0; i < Object.keys(results).length; i++){
            bot.reply(parseInt(user_id), 'Активный пользователь: '+'https://vk.com/id'+results[i].vk_id);
        }
        
    });
  });
pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      return; 
    }
    let sql = "SELECT vk_id FROM chatbot_data WHERE pair_id ='' ";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        return; 
      }
        
        if(Object.keys(results).length > 0){
            for(let i = 0; i < Object.keys(results).length; i++){
            bot.reply(parseInt(user_id), 'Пользователь без пары: '+'https://vk.com/id'+results[i].vk_id);
        }
        }
        
        
    });
  });
    pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      return; 
    }
    let sql = "SELECT vk_id, pair_id FROM chatbot_data WHERE pair_id IS NOT NULL ";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        return; 
      }
        
        if(Object.keys(results).length > 0){
            for(let i = 0; i < Object.keys(results).length; i++){
            bot.reply(parseInt(user_id), "Активный чат:\n" + "https://vk.com/id"+results[i].vk_id + "/ "  + "Общается с https://vk.com/id"+results[i].pair_id);
        }
        }
        
        
    });
  });
};

//SQL API
//Логин
loginUser = function(callback) {
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
    let sql = "SELECT vk_id FROM chatbot_data WHERE vk_id = "+user_id+" ";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
      callback(false, results);
    });
  });
};

//Закрыть сессию
closeSession = function() {
    console.log(2)
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      return; 
    }
    let sql = "UPDATE chatbot_data SET pair_id IS NULL WHERE pair_id = "+user_id+" ";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        return; 
      }
        console.log(results)
    });
  });
    pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      return; 
    }
    let sql = "DELETE FROM chatbot_data WHERE vk_id = "+user_id+"";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        return; 
      }
        console.log(results)
    });
  });
};
//Уведомить пользователя о том, что сессия была закрыта
noticeCloseSession = function() {
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      return; 
    }
    let sql = "SELECT vk_id FROM chatbot_data WHERE pair_id = "+user_id+"";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        return; 
      }
        if(Object.keys(results).length>0 && (parseInt(results[0].vk_id) !== user_id)){
            bot.reply(parseInt(results[0].vk_id), 'Ваш собеседник вышел из чата. Напишите команду start, чтобы начать новую беседу')
        
        }if(current_pair_id !== 0 && current_pair_id !== user_id ){
           bot.reply(current_pair_id, 'Ваш собеседник вышел из чата. Напишите команду start, чтобы начать новую беседу')
       }
         current_pair_id = 0;
        
    });
  });
};
//Найти существующего собеседника
getPairbyId = function(callback, id) {
    console.log('Ищем пару для пользователя#' + id)
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
    let sql = "SELECT pair_id FROM chatbot_data WHERE vk_id = "+id+"";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
      callback(false, results);
    });
  });
};

getPairbyIdFix = function(callback, id, msg) {
    console.log('Ищем пару для пользователя#' + id)
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
    let sql = "SELECT pair_id FROM chatbot_data WHERE vk_id = "+id+"";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
        connection_problems = false;
        if(Object.keys(results).length > 0 && parseInt(results[0].pair_id) == 0){
            bot.reply(user_id, 'Упс! Произошла ошибка. Попробуйте снова отправить сообщение. ');
        }else if(Object.keys(results).length > 0){
           bot.reply(parseInt(results[0].pair_id), "Собеседник: "+msg);
      callback(false, results);
           }else{
               bot.reply(user_id, 'Соединение потеряно. Выхожу из чата. Введите команду start, чтобы найти нового собеседника.');
               closeChat();
           }
        
    });
  });
};
//Внести пользователя в БД
createNewUser = function(callback, id) {
    console.log('Регаю пользователя#' + id)
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
    let sql = "INSERT INTO chatbot_data (vk_id) VALUES("+id+")";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
      callback(results);
    });
  });
};

//Сохранить пару
SetPair = function(callback, id, pair_id) {
    console.log('SetPair');
    console.log(pair_id);
    console.log(id);
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
      let sql = "UPDATE chatbot_data SET pair_id = "+pair_id+" WHERE vk_id = "+user_id+" ";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
    });
  });
    pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
     let sql = "UPDATE chatbot_data SET pair_id = "+user_id+" WHERE vk_id = "+pair_id+" ";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
      callback(results);
    });
  });
};

//Найти пару
getFreePairbyId = function(callback) {
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
    let sql = "SELECT vk_id FROM chatbot_data WHERE pair_id IS NULL AND vk_id != "+user_id+"  AND vk_id != '' ";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
        if(Object.keys(results).length > 0){
            current_pair_id = parseInt(results[0].vk_id);
            console.log('id'+current_pair_id)
        }
    
      callback(results);
    });
  });
};

//Сохранить пару


//Update Pairs

//Обновить текущую пару
function UpdateCurrentPair(status, data){
    if(!status && data[0].pair_id !== ''){
        current_pair_id = parseInt(data[0].pair_id);
        console.log('Пользователь#'+user_id + ' нашёл активный чат с пользователем #'+current_pair_id);
        SendMessage();
    }else{
        bot.reply(user_id,'У вас нет в данный момент активных чатов');
        findPair()
    }
}

//Создать чат
function CreateChat(data){
    if(Object.keys(data).length !== 0){
        bot.reply(user_id, 'Найден собеседник! Напишите сообщение...');
        bot.reply(current_pair_id, 'Найден собеседник!');
        SetPair(SendMessage, user_id, current_pair_id);
        //SendMessage();
    }else{
        bot.reply(user_id, 'К сожалению, свободных собеседников нет.');
    }
}

//Внести пользователя
function InsertUser(data){
    bot.reply(user_id, 'Вы были зарегистрированы в чат-боте. Пробуем найти вам собеседника...');
    findPair()
}

//Проверить доступ
function checkAccess(){
    getPairbyId(UpdateCurrentPair, user_id);
}

let connection_problems = false;
//Отправить сообщение
function SendMessage(){
    chatting = true;
        console.log('От кого: ' + user_id);
    console.log('Кому: ' + current_pair_id);
        bot.on(function (res){
        user_id = parseInt(res.user_id);
            //if(user_id === current_pair_id){
            if(res.body!==''){
                getPairbyIdFix(UpdateCurrentPair, user_id, res.body);
                connection_problems = true; 
            }else{
                res.reply('К сожалению, стикеры, или что вы там отправили, не поддерживаются.');
            }
                
            console.log('Пользователь #'+user_id + ' отправил сообщение ('+res.body+') пользователю #'+current_pair_id); 
                
            
}) 
}

//mysql://b09805f711cdac:c362ba82@us-cdbr-iron-east-01.cleardb.net/heroku_2cf38b0299dd81c?reconnect=true