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
    getCurrentUser: function (callback, user_id, message) {
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
                module.exports.joinPair(callback, user_id, result, message)
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
            let sql = "SELECT * FROM chatbot_data WHERE pair_id = "+user_id+"";
            connection.query(sql, [], function (err, result) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                if(Object.keys(result).length === 0){
                   module.exports.checkIfWasRegistered(callback, user_id);
                }else if(Object.keys(result).length !== 0){
                    callback(true, result, user_id);
                }
            });
        });
    },
    checkIfWasRegistered: function (callback, user_id) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "SELECT vk_id FROM chatbot_data WHERE vk_id = "+user_id+"";
            connection.query(sql, [], function (err, result) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                if(Object.keys(result).length === 0){
                   callback(true, false, user_id);
                }else if(Object.keys(result).length !== 0){
                    module.exports.selectFreeUser(callback, user_id);
                }
            });
        });
    },
    selectFreeUser: function (callback, user_id) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "SELECT vk_id FROM chatbot_data WHERE pair_id IS NULL AND vk_id != "+user_id+"";
            connection.query(sql, [], function (err, result) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                if(Object.keys(result).length === 0){
                    callback(true, result, user_id);
                }else if(Object.keys(result).length !== 0){
                    module.exports.insertPair(callback, user_id, result);
                }
            });
        });
    },
    insertPair: function (callback, user_id, result) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "UPDATE chatbot_data SET pair_id = "+user_id+" WHERE vk_id = "+result[0].vk_id+"";
            connection.query(sql, [], function (err, output) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                module.exports.savePair(callback, user_id, result);
                
            });
        });
    },
    savePair: function (callback, user_id, result) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "UPDATE chatbot_data SET pair_id = "+result[0].vk_id+" WHERE vk_id = "+user_id+"";
            connection.query(sql, [], function (err, output) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                console.log(callback.name)
                if(callback.name === 'loginChat' || callback.name === 'createChat'){
                    callback(true, result, user_id);
                }else if(callback.name === 'joinChat'){
                    module.exports.joinPair(callback, user_id, result);
                }
                
            });
        });
    },
    joinPair: function (callback, user_id, result, message) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "UPDATE chatbot_data SET joined = 1 WHERE vk_id = "+user_id+" OR pair_id = "+user_id+"";
            connection.query(sql, [], function (err, output) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                    callback(true, result, user_id, message);
                
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
                    module.exports.createUser(callback, user_id)
                }else{
                    callback(true, false, user_id);
                }
                
            });
        });
    },
    checkIfJoined: function (callback, callbackOfCallback, user_id, noticeUser) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "SELECT vk_id FROM chatbot_data WHERE vk_id = "+user_id+" AND joined = 1 ";
            connection.query(sql, [], function (err, result) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                if(callback.name === 'destroyUser'){
                    if(Object.keys(result).length === 0){
                    noticeChat(user_id)                   
                }else{
                    callback(callbackOfCallback, user_id)
                }
                }
                if(Object.keys(result).length === 0){
                    callback(callbackOfCallback, user_id)
                }else{
                    noticeUser(user_id)
                }
                
            });
        });
    },
    destroyUser: function(callback, user_id){
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "DELETE FROM chatbot_data WHERE vk_id = "+user_id+"";
            connection.query(sql, [], function (err, result) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                module.exports.destroyPair(callback, user_id)
                
                
            });
        });
    },
    destroyPair: function(callback, user_id){
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "UPDATE chatbot_data SET pair_id = NULL WHERE  vk_id = "+user_id+"";
            connection.query(sql, [], function (err, result) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                callback(true, user_id)
                
            });
        });
    }
    
    
};