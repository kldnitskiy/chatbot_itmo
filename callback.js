const mysql = require('mysql')
let pool  = mysql.createPool({
   host     : "localhost",
   user     : "root",
   password : "1812danil",
   database : "chatbot_itmo"
});
module.exports = {

  updateUserInfo: function (status, result) {
    if(status){
        
    }else{
        console.log('Произошла ошибка при обновлении данных');
    }
  }
};