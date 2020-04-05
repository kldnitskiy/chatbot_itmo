const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const server = express()
const bot = new Botact({
    token: '91c66aec637d3f1ea0615132ea568793ffc55b18c0dd878c386584ee226bf7264f669f30cc61986c8e3e2',
    confirmation: 'f5f07863'
})
let btnSearch = {
    "one_time": false,
    "buttons": [
        [{
                "action": {
                    "type": "text",
                    "label": "Search"
                },
                "color": "primary"
            },
         {
                "action": {
                    "type": "text",
                    "label": "Join"
                },
                "color": "primary"
            }
        ]
    ]
}
let btnJoin = {
    "one_time": true,
    "buttons": [
        [{
                "action": {
                    "type": "text",
                    "label": "Join"
                },
                "color": "Primary"
            }
        ]
    ]
}
let carouselChats = {
        "title": "Title",
        "description": "Description",
        "action": {
                "type": "open_link",
                "link": "https://vk.com"
        },
        "photo_id": "-109837093_457242809",
        "buttons": [{
                "action": {
                        "type": "text",
                        "label": "Label"
                }
        }]
}
module.exports = {
  updateUserInfo: function (status, result, user_id) {
      //Проверяем статус запроса
      if(!status){
          bot.reply(user_id, 'Произошла ошибка на сервере. Попробуйте позже.');
      }
    if(Object.keys(result).length === 0){
        bot.reply(user_id, 'Вижу, тебя нет в базе. Введите команду search, чтобы найти собеседника.', btnSearch);
    }else if(status){
        pair_id = result[0].pair_id;
        bot.reply(user_id, 'У вас есть активный чат. Напишите join, чтобы войти в него.', null, btnJoin);
    }
  }
};