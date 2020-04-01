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
let user_id;
let current_pair_id;

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


//getPair
getPair = function(callback, id, msg) {
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
      pair = results[0].vk_id;  
        partner_id = pair;
      callback(false, results, pair, msg);
        
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
    console.log('Запрос от ' + id)
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
    let sql = "SELECT pair_id FROM chatbot_data WHERE vk_id = "+id+" AND pair_id !=''";
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
      let sql = "UPDATE chatbot_data SET pair_id = (case when vk_id = "+id+" then  "+pair_id+" when vk_id =  "+pair_id+" then  "+id+" end)";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
        //return results;
      callback(false, results, id, parseInt(pair_id));
    });
  });
};


//CALLBACKS
//let users = getUsers(saveUsers);
function saveUsers(status, result){
    users = result;
    console.log('Всего пользователей');
    console.log(users);
}

function savePair(status, result, pair){
}
//let unpaired = getUnPaired(saveUnpaired);
function saveUnpaired(status, result){
    unpaired = result;
    console.log('Всего без пары');
    console.log(unpaired);
}
function savePaired(status, result, id, pair_id){
   bot.reply(id, 'Собеседник найден! Устанавливаем соединение...');  
    bot.reply(pair_id, 'Собеседник найден! Устанавливаем соединение...');  
    bot.reply(id, 'Напишите команду /go, чтобы подключиться к чату, а затем начните беседу'); 
    bot.reply(pair_id, 'Напишите команду /go, чтобы подключиться к чату, а затем начните беседу');  
    if(connected === false){
        connected = true;
    }
    //bot.reply(pair_id, 'Собеседник найден! Устанавливаем соединение...'); 
    let pair = getPair(savePair, id);
}
function checkifUnpaired(status, result, user_message){
    //DETECT PAIR
    //console.log(result);
    if(Object.keys(result).length === 0){
        if(connected !== true){
            connected = false;
        }
        
        //Bot action
        user_message.reply('Вижу, вам пока не был назначен собеседник. Начинаю поиск пары...');
        
        for(let i = 0; i < unpaired.length; i++){
            if(parseInt(unpaired[i].vk_id) !== parseInt(user_message.user_id)){
                pair_id = unpaired[i].vk_id;
                delete unpaired[i];
                console.log(pair_id);
                break;
            }
        }
        SetPair(savePaired, user_message.user_id, pair_id);
    }else{
        
        connected = true;
        //Bot action
        partner_id = pair;
        bot.reply(parseInt(partner_id),user_message.body);
        pair = getPair(savePair, user_message.user_id);
        
    }
}

let current_message;


function bot_respond(status, result, id, msg){
    bot.reply(parseInt(id), 'Собеседник: ' + msg);
}

function botSay(id,msg){
    bot.reply(id,msg);
}
//SAVENEWMEMBER
saveNewMember = function(callback, id) {
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
        console.log(results);
      callback(false, results, parseInt(id));
        
    });
  });
};
//CLOSE SESSION
closeSession = function(callback, id) {
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(true); 
      return; 
    }
    let sql = "UPDATE chatbot_data SET pair_id = (case when vk_id = "+id+" then '' when pair_id =  "+id+" then  '' end)";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(true); 
        return; 
      }
        bot.reply(parseInt(pair), 'Ваш собеседник покинул чат. Напишите команду /start, чтобы начать новую беседу.')
        connected = false;
        partner_id = 0;
      callback(false, results);
        
    });
  });
};
function Session(status, results){
    
}

function saveMember(status, results, id){
    console.log(id);
    bot.reply(parseInt(id), 'Поздравляем! Вы зарегистрированы в чат-боте!\n Напишите что-нибудь, чтобы начать анонимную переписку.')
    
}
//saveNewMember(saveMember, reply.vk_id);


//BOT BASIC EVENTS

//Стандартные сообщения
let group_join_msg = 'Добро пожаловать в семью!Ты сделал маленький, но весомый шаг к незабываемой студенческой жизни♥Это особенное место с неповторимыми людьми✨ А ты уже - наша часть 😌Мы обещаем, будет интересно 😏. \nНапишите команду start, чтобы присоединиться к анонимной беседе студентов.';
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
    ctx.reply('Ищем собеседника...');
    console.log("Пользователь #"+ctx.user_id+" ввёл команду start");
    loginUser(UpdateLoginStatus);
})
//начать беседу
bot.command('go', (ctx) => {
    ctx.reply('Вы подключены к чату');
    console.log("Пользователь #"+ctx.user_id+" подключился к чату с пользователем #000000");
})
//выйти из беседы
bot.command('exit', (ctx) => {
    ctx.reply('Завершаем сеанс. Напишите команду /start, чтобы найти нового собеседника.');
    console.log("Пользователь #"+ctx.user_id+" завершил сеанс с пользователем #000000");
    //closeSession(Session, parseInt(ctx.user_id));
})

//loginUser

//START
function UpdateLoginStatus(status, id){
    id = parseInt(id[0].vk_id)
    if(!status){
        bot.reply(id, 'Выполнен вход в чат')
    }else{
        bot.reply(id, 'Вы ещё не зарегистрированы');
    }
}
function startChat(){
    getPairbyId(UpdateCurrentPair, user_id);
    
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
        //return results;
      callback(false, results);
    });
  });
};

//Найти собеседника
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
function UpdateCurrentPair(status, pair){
    if(!status){
        current_pair_id = parseInt(pair[0].pair_id);
        console.log('Пользователь#'+user_id + ' нашёл активный чат с пользователем #'+current_pair_id);
        SendMessage();
    }else{
        bot.reply(user_id,'У вас нет в данный момент активных чатов');
    }
}
function SendMessage(){
    bot.on(function (res){
        bot.reply(current_pair_id, 'Собеседник: '+res.body);
        console.log('Пользователь #'+user_id + ' отправил сообщение ('+res.body+') пользователю #'+current_pair_id);
})
}
    

//BOT REPLIES
/*
    bot.on(function (user_message){
    msg = user_message.body;
    console.log(user_message.user_id + 'Отправлено к: ' +partner_id);
    console.log(user_message.user_id + ':'+msg);
        //NO commands
        if(msg!=='start' && msg!=='/start'){
            if(partner_id===0){
                isUnpaired = CheckPair(checkifUnpaired, user_message.user_id,user_message); 
}     
        if(connected && parseInt(partner_id)!==0){
            if(parseInt(partner_id) !== user_message.user_id){
                bot.reply(parseInt(partner_id), 'Собеседник: ' +msg);
            }else{
                getPair(bot_respond, user_message.user_id, user_message.body);
            }
            
        }
        }
        let isUnpaired;
})

*/


//mysql://b09805f711cdac:c362ba82@us-cdbr-iron-east-01.cleardb.net/heroku_2cf38b0299dd81c?reconnect=true