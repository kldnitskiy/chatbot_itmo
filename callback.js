const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const server = express()
const bot = new Botact({
    token: '91c66aec637d3f1ea0615132ea568793ffc55b18c0dd878c386584ee226bf7264f669f30cc61986c8e3e2',
    confirmation: '9ebed8d2'
})
module.exports = {
    requestManager: function(status, user_id, msg, pair_id){
        if(status !== ''){
            if(msg !== null){
            bot.reply(pair_id, msg);
        }else if(msg === ''){
            bot.reply(pair_id, 'Мегабот: к сожалению, стикеры, фото, видео не поддерживаются.');
            bot.reply(user_id, 'Мегабот: к сожалению, стикеры, фото, видео не поддерживаются.');
        }
        }else{
           if(status === 'createdPair'){
            bot.reply(user_id, 'Мегабот: Вы вошли в чат! Напишите что-нибудь своему собеседнику.')
            bot.reply(pair_id, 'Мегабот: Для вас был найден собеседник! Напишите что-нибудь.')
        }else if(status === 'noPair'){
            bot.reply(user_id, 'Мегабот: К сожалению, пока не удалось найти вам собеседника. Попробуйте чуть позже.')
        } 
        }
        
        
        
    }
};