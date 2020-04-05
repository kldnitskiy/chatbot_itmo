const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const server = express()
module.exports = {

  updateUserInfo: function (status, result) {
    if(status){
        user_id = result[0].vk_id;
        pair_id = result[0].pair_id;
    }else{
        bot.reply(user_id, 'Произошла ошибка на сервере. Попробуйте позже.');
    }
  }
};