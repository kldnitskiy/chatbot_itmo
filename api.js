const mysql = require('mysql')
let pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1812danil",
    database: "chatbot_itmo"
})
module.exports = {
    getCurrentUser: function (callback, user_id) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            let sql = "SELECT * FROM chatbot_data WHERE vk_id = " + id + " ";
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
    bar: function () {
        // whatever
    }
};