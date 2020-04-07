const mysql = require('mysql')
let pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1812danil",
    database: "chatbot_itmo"
})
module.exports = {
    checkIfWasRegistered: function (callback, user_id, msg) {
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
                if(msg==='operation::code=exit')
                if(Object.keys(result).length !== 0){
                    module.exports.checkIfHadPair(callback, user_id, msg);
                }else{
                    module.exports.registerUser(callback, user_id, msg);
                }
            });
        });
    },
    checkIfHadPair: function (callback, user_id, msg) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "SELECT vk_id FROM chatbot_data WHERE pair_id = "+user_id+" AND joined != 0";
            connection.query(sql, [], function (err, result) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                if(Object.keys(result).length !== 0){
                    callback('createdPairRepeat', user_id, msg, result[0].vk_id)
                }else{
                   module.exports.findPair(callback, user_id, msg);
                }
                
            });
        });
    },
    registerUser: function (callback, user_id, msg) {
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
                module.exports.findPair(callback, user_id, msg);
                
            });
        });
    },
    findPair: function (callback, user_id, msg) {
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
                if(Object.keys(result).length !== 0){
                    module.exports.createPair(callback, user_id, result[0].vk_id, msg)
                }else{
                    callback('noPair', user_id, msg)
                }
                
            });
        });
    },
    createPair: function (callback, user_id, pair_id, msg) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "UPDATE chatbot_data SET pair_id = (case when vk_id = "+user_id+" then "+pair_id+" when vk_id = "+pair_id+" then "+user_id+" end), joined = 1 WHERE vk_id in ("+user_id+", "+pair_id+");";
            connection.query(sql, [], function (err, result) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                callback('createdPair', user_id, msg, pair_id)
            });
        });
    },
    exitChat: function (callback, user_id, msg){
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "UPDATE chatbot_data SET joined = 0, pair_id = NULL WHERE pair_id = "+user_id+" OR vk_id = "+user_id+" ;";
            connection.query(sql, [], function (err, result) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    callback(false);
                    return;
                }
                callback('removedPair', user_id, msg, null)
            });
        });
    }
    
};