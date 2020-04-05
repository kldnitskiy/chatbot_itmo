const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const server = express()
module.exports = {

  updateUserInfo: function (status, result) {
      //Проверяем статус запроса
      if(!status){
          bot.reply(user_id, 'Произошла ошибка на сервере. Попробуйте позже.');
      }
    if(Object.keys(result).length === 0){
        bot.reply(user_id, 'Вижу, тебя нет в базе. Введите команду search, чтобы найти собеседника.');
    }else if(status){
        pair_id = result[0].pair_id;
        bot.reply(user_id, 'У вас есть активный чат. Напишите join, чтобы войти в него.');
    }
  }
};