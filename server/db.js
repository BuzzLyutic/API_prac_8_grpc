const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    db.run(
      `CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username text UNIQUE,
          password text
          )`,
      (err) => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
        }
      }
    );
  }
});

module.exports = db;

/*const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Initialize the database with a users table
db.serialize(() => {
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
});

module.exports = db;*/