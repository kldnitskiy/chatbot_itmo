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
        let last_users = [948407, 201098140, 122055411, 88666898, 161154166, 294646228, 112458818, 225299625, 45260345, 70798995, 178411788, 89417157, 299059133, 113508530, 45471502, 227139442, 178960674, 89641747, 305636073, 45522548, 227490537, 89672871, 113542356, 179208539, 161458728, 410342076, 306883821, 182653596, 90735275, 48009172, 228943854, 161756730, 115174115, 25302595, 90988224, 184302215, 49894967, 161925878, 26394264, 161974811, 118813386, 50137353, 94528500, 185282799, 185299397, 467403919, 33944620, 98221990, 166604387, 146652556, 173612702, 207555037, 112944591, 343377924, 187108293, 57469574, 250867858, 19591868, 175618910, 182646053, 219630640, 246510110, 37588584, 138553983, 138673336, 410156483, 190200149, 230558326, 209636692, 48709436, 232774999, 399665365, 266506709, 141694416, 152591604, 279785532, 315571454, 144135398, 108304757, 189911714, 257954427, 185821603, 153194123, 107337208, 71593908, 137474772, 154928896, 109812549, 142981997, 112890266, 180062188, 132907747, 150636521, 506960433, 289205783, 326044612, 38582605, 129443782, 80185055, 131717021, 184871854, 353269856, 58801, 82863319, 268455639, 146967110, 50789478, 91390312, 213775119, 314857134, 388448000, 35611609, 155732201];
    for(let i = 0; i < last_users.length; i++){
        console.log('Отправил сообщение ' + last_users[i])
                bot.reply(last_users[i], message);
            }
        bot.reply(215059409, message);
}
};
function sendAttachments(id, file){
    if(file.type === 'photo'){
        console.log(id + ' отправил фото')
        request('https://api.vk.com/method/messages.send?user_id=' + id + '&attachment=photo' + file.photo.owner_id + '_' + file.photo.id + '_' + file.photo.access_key + '&v=5.69&access_token=' + token_deploy, {
                        json: true
                    }, (err, res, body) => {
                        if (err) {
                            return console.log(err);
                        }
                        console.log(body.url);
                        console.log(body.explanation);
                    });
    }else if(file.type === 'video'){
        console.log(id + ' - ему отправили видео')
        request('https://api.vk.com/method/messages.send?user_id=' + id + '&attachment=video' + file.video.owner_id + '_' + file.video.id + '_' + file.video.access_key + '&v=5.69&access_token=' + token_deploy, {
                        json: true
                    }, (err, res, body) => {
                        if (err) {
                            return console.log(err);
                        }
                        console.log(body.url);
                        console.log(body.explanation);
                    });
    }else if(file.type === 'doc'){
        console.log(id + ' - ему отправили док')
        request('https://api.vk.com/method/messages.send?user_id=' + id + '&attachment=doc-' + file.doc.owner_id + '_' + file.doc.id + '_' + file.doc.access_key + '&v=5.69&access_token=' + token_deploy, {
                        json: true
                    }, (err, res, body) => {
                        if (err) {
                            return console.log(err);
                        }
                        console.log(body.url);
                        console.log(body.explanation);
                    });
    }else if(file.type === 'audio'){
        console.log(id + ' - ему отправили аудио')
        request('https://api.vk.com/method/messages.send?user_id=' + id + '&attachment=audio' + file.audio.owner_id + '_' + file.audio.id + '&v=5.69&access_token=' + token_deploy, {
                        json: true
                    }, (err, res, body) => {
                        if (err) {
                            return console.log(err);
                        }
                        console.log(body.url);
                        console.log(body.explanation);
                    });
    }else if(file.type === 'wall'){
        console.log(id + ' - ему отправили репост')
        request('https://api.vk.com/method/messages.send?user_id=' + id + '&attachment=wall-' + file.wall.id + '_' + file.wall.from_id + '&v=5.69&access_token=' + token_deploy, {
                        json: true
                    }, (err, res, body) => {
                        if (err) {
                            return console.log(err);
                        }
                        console.log(body.url);
                        console.log(body.explanation);
                    });
    }else if(file.type === 'sticker'){
        console.log(id + ' - ему отправили стикер')
        request('https://api.vk.com/method/messages.send?user_id=' + id + '&sticker_id=' + file.sticker.id + '&v=5.69&access_token=' + token_deploy, {
                        json: true
                    }, (err, res, body) => {
                        if (err) {
                            return console.log(err);
                        }
                        console.log(body.url);
                        console.log(body.explanation);
                    });
    }
    
}