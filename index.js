//MODULES
const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const server = express()
const PORT = process.env.PORT || 80
const api = require('./api')
const callback = require('./callback')


//BOT SETUP
const bot = new Botact({
    token: '90d67689d33c7adb2c824014c240df5c28797dc1460865ebcc8d840fe6218ca5cd09442654eb103c69e3c',
    confirmation: '1e2b3c66'
})


//SERVER SETUP
server.use(bodyParser.json())
server.post('/', bot.listen)
server.get('/', (request, response) => {
    request.header('Content-Type', 'application/json')
    response.send('1e2b3c66')
})
server.listen(PORT)
bot.event('group_join', ({ reply }) => {
  reply('Добро пожаловать в семью!\n\nТы сделал маленький, но весомый шаг к незабываемой студенческой жизни♥\n\nЭто особенное место с неповторимыми людьми✨ А ты уже - наша часть 😌\n\nМы обещаем, будет интересно 😏')
    reply('И чтобы ты не скучал в перерывах между конкурсами, специально для тебя нами был разработан анонимный чат-бот!\nВведи команду Join, чтобы найти собеседника\nВведи команду Exit, чтобы покинуть чат.\n\nРазвлекайся!');
})
bot.command('Join', (res) => {
    console.log(res.user_id + ' написал: ' + res.body)
    res.body = null
    api.checkIfWasRegistered(callback.requestManager, res.user_id, res);
})
bot.command('Exit', (res) => {
    console.log(res.user_id + ' написал: ' + res.body)
    res.body = null
     api.noticeExit(callback.requestManager, res.user_id, res);
})
bot.on(function (res){
    console.log(res.user_id + ' написал: ' + res.body)
    if(res.body.length > 140){
        res.reply('Сообщения не должно содержать больше 140 знаков.');
    }else{
        api.isInChat(callback.requestManager, res.user_id, res);
    }
    
    
})