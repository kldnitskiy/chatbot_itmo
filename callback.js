const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const server = express()
module.exports = {

  updateUserInfo: function (status, result) {
    if(status){
        
    }else{
        console.log('Произошла ошибка при обновлении данных')
    }
  }
};