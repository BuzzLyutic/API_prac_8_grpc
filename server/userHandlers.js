const db = require('./db');
const grpc = require('@grpc/grpc-js');

const userHandlers = {
  Login: (call, callback) => {
    const { username, password } = call.request;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
      if (err) return callback(err);
      if (row) {
        callback(null, { message: `Hello, ${username}` });
      } else {
        callback(null, { message: 'Invalid username or password'});
      }
    });
  },
  Register: (call, callback) => {
    const { username, password } = call.request;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
      if (err) return callback(err);
      if (row) {
        return callback(null, { message: 'Username already exists' });
      } else {
        db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], (err) => {
          if (err) return callback(err);
          callback(null, { message: 'User registered successfully' });
        });
      }
    });
  },
  UpdateUser: (call, callback) => {
    const { username, oldPassword, newPassword } = call.request;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, oldPassword], (err, row) => {
        if (err) return callback(err);
        if (!row) {
            return callback(null, { message: 'Invalid username or old password' });
        }

        db.run(`UPDATE users SET password = ? WHERE username = ?`, [newPassword, username], function (err) {
            if (err) return callback(err);
            callback(null, { message: 'Password updated successfully' });
        });
    });
  },
  DeleteUser: (call, callback) => {
    const { username, password } = call.request;
      db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
      if (err) return callback(err);
      if (!row) {
          return callback(null, { message: 'Invalid username or password' });
      }

      db.run(`DELETE FROM users WHERE username = ?`, [username], function (err) {
          if (err) return callback(err);
          callback(null, { message: 'User deleted successfully' });
          });
        });
    },
};

module.exports = userHandlers;