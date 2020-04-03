var express    = require("express");
 var mysql      = require('mysql');
 var pool = mysql.createPool({
   host     : 'localhost',
   user     : 'root',
   password : '1812danil',
   database : 'chatbot_data',
 });
 var app = express();
 
pool.getConnection(function(err){
 if(!err) {
     console.log("Database is connected ... \n\n");  
 } else {
     console.log("Error connecting database ... \n\n");  
 }
 });
app.listen(3000);