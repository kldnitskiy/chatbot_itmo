const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const request = require('request');
const server = express()
let token_deploy = '90d67689d33c7adb2c824014c240df5c28797dc1460865ebcc8d840fe6218ca5cd09442654eb103c69e3c';
let confirmation_deploy = '1e2b3c66';
let token_test = '91c66aec637d3f1ea0615132ea568793ffc55b18c0dd878c386584ee226bf7264f669f30cc61986c8e3e2';
let confirmation_test = 'f5f07863';
const bot = new Botact({
    token: token_deploy,
    confirmation: confirmation_deploy 
})

let buttonsInChat = {
    "one_time": false,
    "buttons": [
        [
            {
                "action": {
                    "type": "text",
                    "payload": "{\"Exit\": \"2\"}",
                    "label": "Покинуть чат"
                },
                "color": "negative"
            }
        ]
    ]
}
let buttonsInLobbyOld = {
    "one_time": false,
    "buttons": [
        [{
                "action": {
                    "type": "text",
                    "payload": "{\"Join\": \"1\"}",
                    "label": "Найти чат"
                },
                "color": "positive"
            },
         {
                "action": {
                    "type": "text",
                    "payload": "{\"Leave\": \"3\"}",
                    "label": "Выйти из рулетки"
                },
                "color": "negative"
            },
         {
                "action": {
                    "type": "text",
                    "payload": "{\"Info\": \"4\"}",
                    "label": "Помощь"
                },
                "color": "primary"
            }
        ]
    ]
}
let buttonsInLobby = {
    "one_time": false,
    "buttons": [
        [{
            "action": {
                    "type": "text",
                    "payload": "{\"Join\": \"1\"}",
                    "label": "Найти чат"
                },
                "color": "positive"
        }],
        [{
            "action": {
                    "type": "text",
                    "payload": "{\"Leave\": \"3\"}",
                    "label": "Выйти из рулетки"
                },
                "color": "negative"
        }],
        [{
            "action": {
                    "type": "text",
                    "payload": "{\"Info\": \"4\"}",
                    "label": "Помощь"
                },
                "color": "primary"
        }]
    ]
}

module.exports = {
    requestManager: function(status, user_id, msg, pair_id){
        if(msg.body !== null){
            if(msg.body !== ''){
                    bot.reply(pair_id, msg.body);    
            }else{
                if (typeof msg.attachments!== 'undefined') {
                    sendAttachments(pair_id, msg.attachments[0])
                } else {
                    bot.reply(user_id, 'Мегабот: К сожалению, данный файл пока не поддерживается.', buttonsInChat);
                    bot.reply(pair_id, 'Мегабот: Собеседник хотел отправить вам файл, но он не поддерживается данной чат-рулеткой.', buttonsInChat);
                }
                }
            
        }else{
           if(status === 'createdPair'){
            bot.reply(user_id, 'Мегабот: Вы вошли в чат! Напишите что-нибудь своему собеседнику.', null, buttonsInChat)
            bot.reply(pair_id, 'Мегабот: Для вас был найден собеседник! Напишите что-нибудь.', null, buttonsInChat)
               console.log(user_id + ' нашёл чат с ' + pair_id)
        }else if(status === 'noPair'){
            bot.reply(user_id, 'Мегабот: К сожалению, пока не удалось найти вам свободного собеседника. Либо повторите попытку, либо подождите, пока мы подберём для Вас освободившейся чат.', null, buttonsInLobby)
            console.log(user_id + ' не нашёл чат');
        }else if(status === 'noPairJustMessage'){
            bot.reply(user_id, 'Мегабот: Введите команду Найти чат, чтобы найти собеседника.', null, buttonsInLobby)
        }else if(status === 'createdPairRepeat'){
            bot.reply(user_id, 'Мегабот: В данный момент вы находитесь в чате.', null, buttonsInChat)
            console.log(user_id + ' попытался выйти во время чата');
        }else if(status === 'removedPair'){
            bot.reply(user_id, 'Мегабот: Вы покинули чат.', null, buttonsInLobby)
        }else if(status === 'noticeExit'){
            bot.reply(pair_id, 'Мегабот: Ваш собеседник покинул чат. Введите Найти чат, чтобы найти свободный чат, либо Выйти из рулетки, если хотите выйти из чат-рулетки.', null, buttonsInLobby)
            console.log('Собеседник пользователя ' + pair_id + ' покинул чат');
        }else if(status === 'leaveChat'){
            bot.reply(user_id, 'Мегабот: Вы вышли из чат-рулетки. Поиск собеседников приостановлен. Введите Найти чат, чтобы найти свободный чат.', null, buttonsInLobby)
        }
        }
    },
    //ADMIN things
    sendMessageGlobal: function(data, message){
        console.log('Рассылаю текст: ' + message);
    for(let i = 0; i < Object.keys(data).length; i++){
        console.log('Отправил сообщение ' + data[i].vk_id)
                bot.reply(data[i].vk_id, message);
            }
        bot.reply(215059409, message);
}
};
function sendAttachments(id, file){
    if(file.type === 'photo'){
        console.log(id + ' отправил фото')
        bot.reply(id, '', 'attachment=photo' + file.photo.owner_id + '_' + file.photo.id + '_' + file.photo.access_key);
    }else if(file.type === 'video'){
        console.log(id + ' - ему отправили видео')
        bot.reply(id, '', 'attachment=video' + file.video.owner_id + '_' + file.video.id + '_' + file.video.access_key);
    }else if(file.type === 'doc'){
        console.log(id + ' - ему отправили док')
         bot.reply(id, '', 'attachment=doc' + file.doc.owner_id + '_' + file.doc.id + '_' + file.doc.access_key);
    }else if(file.type === 'audio'){
        console.log(id + ' - ему отправили аудио')
        bot.reply(id, '', 'attachment=audio' + file.audio.owner_id + '_' + file.audio.id);
    }else if(file.type === 'wall'){
        console.log(id + ' - ему отправили репост')
        bot.reply(id, '', 'attachment=wall' + file.wall.id + '_' + file.wall.from_id);
    }else if(file.type === 'sticker'){
        console.log(id + ' - ему отправили стикер')
        bot.reply(id, '', [{sticker_id: file.sticker.id}]);
    }
    
}