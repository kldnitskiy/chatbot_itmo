const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const server = express()
const bot = new Botact({
    token: '90d67689d33c7adb2c824014c240df5c28797dc1460865ebcc8d840fe6218ca5cd09442654eb103c69e3c',
    confirmation: '1e2b3c66'
})
let buttons = {
    "one_time": false,
    "buttons": [
        [{
                "action": {
                    "type": "text",
                    "payload": "{\"Join\": \"1\"}",
                    "label": "Join"
                },
                "color": "positive"
            },
            {
                "action": {
                    "type": "text",
                    "payload": "{\"Exit\": \"2\"}",
                    "label": "Exit"
                },
                "color": "negative"
            }
        ]
    ]
}
let removeButtons = {
    "one_time": false,
    "buttons": [
        [{
                "action": {
                    "type": "text",
                    "payload": "{\"Join\": \"1\"}",
                    "label": "Join"
                },
                "color": "positive"
            },
            {
                "action": {
                    "type": "text",
                    "payload": "{\"Exit\": \"2\"}",
                    "label": "Exit"
                },
                "color": "primary"
            },
         {
                "action": {
                    "type": "text",
                    "payload": "{\"Leave\": \"3\"}",
                    "label": "Leave"
                },
                "color": "negative"
            }
        ]
    ]
}
module.exports = {
    requestManager: function(status, user_id, msg, pair_id){
        if(msg.body !== null){
            if(msg.body !== ''){
                    bot.reply(pair_id, msg.body);
            }else{
                bot.reply(user_id,'Мегабот: К сожалению, стикеры и медиафайлы пока не поддерживаются.', buttons);
                bot.reply(pair_id,'Мегабот: Собеседник хотел отправить вам стикеры или медиавложение, но они пока не поддерживаются.', buttons);
            }
            
        }else{
           if(status === 'createdPair'){
            bot.reply(user_id, 'Мегабот: Вы вошли в чат! Напишите что-нибудь своему собеседнику.', null, buttons)
            bot.reply(pair_id, 'Мегабот: Для вас был найден собеседник! Напишите что-нибудь.', null, buttons)
        }else if(status === 'noPair'){
            bot.reply(user_id, 'Мегабот: К сожалению, пока не удалось найти вам свободного собеседника. Либо повторите попытку, либо подождите, пока мы подберём для Вас освободившейся чат.', null, removeButtons)
        }else if(status === 'noPairJustMessage'){
            bot.reply(user_id, 'Мегабот: Введите команду Join, чтобы найти собеседника.', null, removeButtons)
        }else if(status === 'createdPairRepeat'){
            bot.reply(user_id, 'Мегабот: В данный момент вы находитесь в чате.', null, buttons)
        }else if(status === 'removedPair'){
            bot.reply(user_id, 'Мегабот: Вы покинули чат. Введите Join, чтобы найти собеседника, либо Leave, если хотите выйти из чат-рулетки.', null, removeButtons)
        }else if(status === 'noticeExit'){
            bot.reply(pair_id, 'Мегабот: Ваш собеседник покинул чат. Введите Join, чтобы найти свободный чат, либо Leave, если хотите выйти из чат-рулетки.', null, removeButtons)
        }else if(status === 'leaveChat'){
            bot.reply(user_id, 'Мегабот: Вы вышли из чат-рулетки. Поиск собеседников приостановлен. Введите Join, чтобы найти свободный чат.', null, removeButtons)
        }
        }
    }
};