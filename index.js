//MODULES
const express = require('express')
const {Botact} = require('botact')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const server = express()
const PORT = process.env.PORT || 80
const api = require('./api')
const callback = require('./callback')

let token_deploy = '90d67689d33c7adb2c824014c240df5c28797dc1460865ebcc8d840fe6218ca5cd09442654eb103c69e3c';
let confirmation_deploy = '1e2b3c66';
let token_test = '91c66aec637d3f1ea0615132ea568793ffc55b18c0dd878c386584ee226bf7264f669f30cc61986c8e3e2';
let confirmation_test = 'f5f07863';
//BOT SETUP
const bot = new Botact({
    token: token_deploy,
    confirmation: confirmation_deploy 
})

let admin_id = 215059409;
let brother_id = 314857134;
let stopForService = true;

//SERVER SETUP
server.use(bodyParser.json())
server.post('/', bot.listen)
server.get('/', (request, response) => {
    request.header('Content-Type', 'application/json')
    response.send(confirmation_test)
})
server.listen(PORT)
bot.event('group_join', ({ reply }) => {
  reply('Добро пожаловать в семью!\n\nТы сделал маленький, но весомый шаг к незабываемой студенческой жизни♥\n\nЭто особенное место с неповторимыми людьми✨ А ты уже - наша часть 😌\n\nМы обещаем, будет интересно 😏')
    reply('И чтобы ты не скучал в перерывах между конкурсами, специально для тебя нами был разработан анонимный чат-бот!\nВведи команду Join, чтобы найти собеседника\nВведи команду Exit, чтобы покинуть чат.\n\nРазвлекайся!');
})


bot.command('Найти чат', (res) => {
    console.log(res.user_id + ' написал: ' + res.body)
    res.body = null
    if(checkIfServicing(res))
    api.checkIfWasRegistered(callback.requestManager, res.user_id, res);
})
bot.command('Покинуть чат', (res) => {
    console.log(res.user_id + ' написал: ' + res.body)
    res.body = null
    if(checkIfServicing(res))
     api.noticeExit(callback.requestManager, res.user_id, res);
})
bot.command('Выйти из рулетки', (res) => {
    console.log(res.user_id + ' написал: ' + res.body)
    res.body = null
    if(checkIfServicing(res))
     api.leaveChat(callback.requestManager, res.user_id, res);
})
bot.command('Помощь', (res) => {
    res.reply('Найти чат - найти присоединиться к чат-рулетке\n\nПокинуть чат - покинуть чат\n\nВыйти из рулетки - выйти из чат-рулетки (автоматический подбор собеседников будет отключен)');
})
bot.on(function (res){
    console.log(res.user_id + ' написал сообщение: ')
    console.log(res.attachments)
    if(res.body.length > 140){
        if(checkIfServicing(res))
        res.reply('Сообщения не должно содержать больше 140 знаков.');
    }else{
        if(checkIfServicing(res))
        api.isInChat(callback.requestManager, res.user_id, res);
    }
})


function checkIfServicing(res){
    if((res.user_id !== admin_id && stopForService) || (res.user_id !== brother_id && stopForService)){
        res.reply('Мегабот: в данный момент проводятся технические работы. Повторите ваш запрос позже.')
        return false
    }else if(!stopForService){
        return true
    }
}