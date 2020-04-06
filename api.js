const mysql = require('mysql')
let pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1812danil",
    database: "chatbot_itmo"
})
let buttons = {
    "one_time": false,
    "buttons": [
        [{
                "action": {
                    "type": "text",
                    "payload": "{\"button\": \"search\"}",
                    "label": "Primary"
                },
                "color": "negative"
            }
        ]
    ]
}
module.exports = {
    getCurrentUser: function (callback, user_id) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "SELECT * FROM chatbot_data WHERE vk_id = " + user_id + " ";
            connection.query(sql, [], function (err, result) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                callback(true, result, user_id);
            });
        });
    },
    searchFreeChat: function (callback, user_id) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "SELECT vk_id FROM chatbot_data WHERE pair_id IS NULL";
            connection.query(sql, [], function (err, result) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                callback(true, result, user_id);
            });
        });
    },
    createUser: function (callback, user_id) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "INSERT INTO chatbot_data (vk_id) VALUES("+user_id+")";
            connection.query(sql, [], function (err, result) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                callback(true, result, user_id);
            });
        });
    },
    checkIfRegistered: function (callback, user_id) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "SELECT  vk_id FROM chatbot_data WHERE vk_id = "+user_id+" ";
            connection.query(sql, [], function (err, result) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                if(Object.keys(result).length === 0){
                    createUser(callback, user_id)
                }else{
                    callback(true, false, user_id);
                }
                
            });
        });
    }
};