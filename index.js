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

//MYSQL SETUP
let pool  = mysql.createPool({
   host     : "localhost",
   user     : "root",
   password : "1812danil",
   database : "chatbot_itmo"
});

//Global vars
let user_id = 0;
let pair_id = null;

bot.command('Login', (res) => {
    console.log(res.user_id + ' написал: ' + res.body)
    api.checkIfJoined(api.checkIfRegistered, callback.loginChat, res.user_id, callback.noticeUser)
    //api.checkIfRegistered(callback.loginChat, res.user_id)
})
bot.command('Search', (res) => {
    console.log(res.user_id + ' написал: ' + res.body)
    api.checkIfJoined(api.searchFreeChat, callback.createChat, res.user_id, callback.noticeUser)
    api.showUsersCount(callback.renderUsers, res.user_id);
    //api.checkIfJoined(user_id)
    //api.searchFreeChat(callback.createChat, res.user_id)
    
})
bot.command('Join', (res) => {
    console.log(res.user_id + ' написал: ' + res.body)
    api.checkIfJoined(api.getCurrentUser, callback.joinChat, res.user_id, callback.noticeUser)
//    api.checkIfJoined(user_id)
//    api.getCurrentUser(callback.joinChat, res.user_id)
})
bot.command('Exit', (res) => {
    console.log(res.user_id + ' написал: ' + res.body)
    api.checkIfJoined(api.destroyUser, callback.removeUser, res.user_id, callback.noticeUser, callback.noticeChat)
//    api.checkIfJoined(user_id)
//    api.getCurrentUser(callback.joinChat, res.user_id)
})
bot.on(function (res){
    if(res.body===''){
        res.reply('Бот: к сожалению, стикеры, фото, видео не поддерживаются.');
    }else{
        api.getCurrentUser(callback.updateUserInfo, res.user_id, res.body);
    }
    
})