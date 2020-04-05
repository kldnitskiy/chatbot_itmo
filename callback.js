const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const server = express()
module.exports = {

  updateUserInfo: function (status, result) {
    if(status){
        user_id = result[0].vk_id;
        pair_id = result[0].pair_id;
        console.log('Пользователь: ' + user_id + '/ Его пара: ' + pair_id);
    }else{
        
    }
  }
};