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
    token: '91c66aec637d3f1ea0615132ea568793ffc55b18c0dd878c386584ee226bf7264f669f30cc61986c8e3e2',
    confirmation: '9ebed8d2'
})


//SERVER SETUP
server.use(bodyParser.json())
server.post('/', bot.listen)
server.get('/', (request, response) => {
    request.header('Content-Type', 'application/json')
    response.send('f5f07863')
})
server.listen(PORT)
bot.event('group_join', ({ reply }) => {
  reply('Добро пожаловать в семью!\n\nТы сделал маленький, но весомый шаг к незабываемой студенческой жизни♥\n\nЭто особенное место с неповторимыми людьми✨ А ты уже - наша часть 😌\n\nМы обещаем, будет интересно 😏')
    reply('Добро пожаловать в анонимную чат-рулетку!\n\nВведи команду Join, чтобы найти собеседника\n\nВведи команду Exit, чтобы покинуть чат.\n\nРазвлекайся!');
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