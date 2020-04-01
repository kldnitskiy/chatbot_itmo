//MODULES
const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const server = express()
const PORT = process.env.PORT || 80


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
server.listen(PORT)


//MYSQL SETUP
let pool  = mysql.createPool({
host: "us-cdbr-iron-east-01.cleardb.net",
user: "b09805f711cdac",
password: "c362ba82",
database: "heroku_2cf38b0299dd81c"
});


//API
let msg; //Текущее сообщение
let connected = false; //Находится в чате
let partner_id = 0; //Id текущей пары
let pair; //Id текущей пары

//GLOBAL VARS
let user_id = 0;
let current_pair_id = 0;
let chatting = false;

//BOT BASIC EVENTS

//Стандартные сообщения
let group_join_msg = 'Добро пожаловать в семью!Ты сделал маленький, но весомый шаг к незабываемой студенческой жизни♥Это особенное место с неповторимыми людьми✨ А ты уже - наша часть 😌Мы обещаем, будет интересно 😏. \nНапишите команду start, чтобы присоединиться к анонимной беседе студентов. Команда exit - завершить чат.';
let group_leave_msg = 'Жаль, что покидаете Нас((';

//Вступление в группу
bot.event('group_join', ({ reply }) => {
  reply(group_join_msg)
    //saveNewMember(saveMember, reply.vk_id);
})
//Выход из группы
bot.event('group_leave', ({ reply }) => {
  reply(group_leave_msg)
})



//Начать беседу + найти пару
bot.command('start', (ctx) => {
    user_id = ctx.user_id;
    if(!chatting){
        ctx.reply('Ищем собеседника...');
    console.log("Пользователь #"+ctx.user_id+" ввёл команду start");
    loginUser(UpdateLoginStatus);
    }else{
        ctx.reply('Бот: В данный момент вы находитесь в активном чате. Если хотите покинуть беседу, напишите команду exit');
    }
    
})
bot.command('Start', (ctx) => {
    user_id = ctx.user_id;
    if(!chatting){
        ctx.reply('Ищем собеседника...');
    console.log("Пользователь #"+ctx.user_id+" ввёл команду start");
    loginUser(UpdateLoginStatus);
    }else{
        ctx.reply('Бот: В данный момент вы находитесь в активном чате. Если хотите покинуть беседу, напишите команду exit');
    }
    
})
//начать беседу
bot.command('go', (ctx) => {
    ctx.reply('Вы подключены к чату');
    console.log("Пользователь #"+ctx.user_id+" подключился к чату с пользователем #000000");
})
//выйти из беседы
bot.command('exit', (ctx) => {
    ctx.reply('Завершаем сеанс. Напишите команду start, чтобы найти нового собеседника.');
    console.log("Пользователь #"+ctx.user_id+" завершил сеанс с пользователем #000000");
    user_id = 0;
    current_pair_id = 0;
    chatting = false;
    closeChat()
})
bot.command('Exit', (ctx) => {
    ctx.reply('Завершаем сеанс. Напишите команду start, чтобы найти нового собеседника.');
    console.log("Пользователь #"+ctx.user_id+" завершил сеанс с пользователем #000000");
    user_id = 0;
    current_pair_id = 0;
    chatting = false;
    closeChat()
})

//loginUser

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
    closeSession();
}
//Зарегать пользователя
function regUser(){
    createNewUser(InsertUser, user_id);
}

//Найти пару
function findPair(){
    getFreePairbyId(CreateChat, user_id);
}


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
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      return; 
    }
    let sql = "UPDATE chatbot_data WHERE pair_id = "+user_id+"";
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
        bot.reply(parseInt(results[0].pair_id), "Собеседник: "+msg);
      callback(false, results);
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
      let sql = "UPDATE chatbot_data SET pair_id = (case when vk_id = "+pair_id+" then  "+id+" when vk_id =  "+id+" then  "+pair_id+" end)";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
        //return results;
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
    let sql = "SELECT vk_id FROM chatbot_data WHERE pair_id = '' AND vk_id != "+user_id+"  AND vk_id != '' ";
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
                getPairbyIdFix(UpdateCurrentPair, user_id, res.body);
            console.log('Пользователь #'+user_id + ' отправил сообщение ('+res.body+') пользователю #'+current_pair_id); 
                connection_problems = true; 
}) 
}

//mysql://b09805f711cdac:c362ba82@us-cdbr-iron-east-01.cleardb.net/heroku_2cf38b0299dd81c?reconnect=true