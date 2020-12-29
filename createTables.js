const express = require('express');
const router = express.Router();
var mysql = require('mysql');
require('dotenv').config();

var db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const checkUserTable = "SHOW TABLES LIKE 'users'";
const createUserTable =
  'CREATE TABLE users ( id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), user_registeredOn DATE)';
const createList =
  'CREATE TABLE lists(listID INT AUTO_INCREMENT NOT NULL PRIMARY KEY , userID INT NOT NULL , listName VARCHAR(255), CONSTRAINT `fk_list_user` FOREIGN KEY (userID) REFERENCES users (id) ON DELETE CASCADE ON UPDATE RESTRICT)';
var createTables = [createUserTable, createList];
router.post('/', (req, res, next) => {
  db.query(checkUserTable, (err, results) => {
    if (err) {
      res.status(400).json({
        success: 0,
        error: 'failed to check userTable',
      });
    } else {
      if (results.length === 0) {
        createTables.forEach(async (table) => {
          await new Promise((resolve, reject) =>
            db.query(table, (error, results) => {
              if (error) {
                console.log(err);
                res.status(400).json({
                  success: 0,
                  error: 'Unable to create table ' + table,
                });
                reject(error);
              } else {
                resolve(results);
              }
            })
          );
        });
        res.status(200).json({ message: 'All tables created. ❤' });
      } else {
        res.status(200).json({ message: 'Table already created.' });
      }
    }
  });
});
module.exports = router;
