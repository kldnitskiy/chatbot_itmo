module.exports = {
  getCurrentUser: function (callback, id) {
    pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      callback(false); 
      return; 
    }
    let sql = "SELECT * FROM chatbot_data WHERE vk_id = "+id+" ";
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        callback(false); 
        return; 
      }
      callback(true, result);
    });
  });
  },
  bar: function () {
    // whatever
  }
};