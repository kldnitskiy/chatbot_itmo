const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const server = express()
const bot = new Botact({
    token: '91c66aec637d3f1ea0615132ea568793ffc55b18c0dd878c386584ee226bf7264f669f30cc61986c8e3e2',
    confirmation: '9ebed8d2'
})
module.exports = {
  updateUserInfo: function (status, result, user_id, message) {
      //Проверяем статус запроса
      if(!status){
          bot.reply(user_id, 'Бот: Произошла ошибка на сервере. Попробуйте позже.');
      }
    if(Object.keys(result).length === 0){
        bot.reply(user_id, 'Бот: Вижу, тебя нет в базе. Введите команду login чтобы зарегистрироваться в чат-рулетке.');
    }else if(status && result[0].pair_id !== null){
        //ЧАТ
        pair_id = result[0].pair_id;
        console.log(result[0].vk_id + ' написал пользователю ' + result[0].pair_id + ':"' + message +'"')
        bot.reply(pair_id, message);
//        bot.reply(user_id, 'У вас есть активный чат. Введите команду Join, чтобы войти в него.');
    }else if(result[0].pair_id === null){
        bot.reply(user_id, 'Бот: Похоже, вы были зарегистрированы в чат рулетке, но у вас пока нет собеседника. Введите команду Search, чтобы найти чат.');
    }
  },
    createChat: function (status, result, user_id){
      //Проверяем статус запроса
      if(!status){
          bot.reply(user_id, 'Бот: Произошла ошибка на сервере. Попробуйте позже.');
      }
    if(Object.keys(result).length === 0 && typeof(result)==='object'){
        bot.reply(user_id, 'Бот: К сожалению, нет свободных чатов. Попробуйте чуть позже.');
    }else if(status && result){
        pair_id = result[0].vk_id;
        bot.reply(user_id, 'Бот: Добро пожаловать в анонимный чат! Введите команду Join, чтобы войти в него.');
        console.log(result);
        bot.reply(pair_id, 'Бот: С вами хотят связаться! Введите Join, чтобы начать войти в чат.');
    }else if(status && !result){
        bot.reply(user_id, 'Бот: Вы ещё не зарегистрированы в чат-рулетке. Введите команду Login, чтобы войти в систему.');
    }
},
    loginChat: function (status, result, user_id){
        //Проверяем статус запроса
      if(!status){
          bot.reply(user_id, 'Бот: Произошла ошибка на сервере. Попробуйте позже.');
      }else if(status && result === false){
        bot.reply(user_id, 'Бот: Вы вошли в чат-рулетку! Введите команду Search, чтобы найти собеседника.');
    }else if(status && result !== false){
        bot.reply(user_id, 'Бот: Вы были зарегистрированы в рулетке! Введите команду Search, чтобы найти собеседника.');
    }
    },
    joinChat: function (status, result, user_id){
        //Проверяем статус запроса
      if(!status){
          bot.reply(user_id, 'Бот: Произошла ошибка на сервере. Попробуйте позже.');
      }else if(Object.keys(result).length === 0 && typeof(result)==='object'){
         bot.reply(user_id, 'Бот: Вы ещё не зарегистрированы в чат-рулетке. Введите команду Login, чтобы войти в систему.');
    }else if(result[0].pair_id === null){
        bot.reply(user_id, 'Бот: Вы пока что не состоите ни в одном чате. Введите команду Search, чтобы найти собеседника.');
    }else if(result[0].pair_id !== null){
        bot.reply(user_id, 'Бот: Соединение установлено. Напишите что-нибудь своему собеседнику.');
        bot.reply(result[0].pair_id, 'Бот: Соединение установлено. Напишите что-нибудь своему собеседнику.');
    }
    },
    noticeUser: function (user_id){
        bot.reply(user_id, 'Бот: Команды Login, Join и Search недоступны во время чата.')
    },
    noticeChat: function (user_id){
        bot.reply(user_id, 'Бот: Вы пока не находитесь ни в одном чате, так что нет смысла использовать команду Exit.')
    },
    removeUser: function (status, user_id, pair_id){
        if(status){
            bot.reply(user_id, 'Бот: Вы покинули чат.')
            bot.reply(pair_id, 'Бот: Собеседник покинул чат.')
        }else{
            bot.reply(user_id, 'Бот: Произошла ошибка при выходе из чата.')
        }
        
    },
    renderUsers: function (data, user_id){
        bot.reply(user_id, 'Бот: Всего пользователей: ' + Object.keys(data).length)
    }
};