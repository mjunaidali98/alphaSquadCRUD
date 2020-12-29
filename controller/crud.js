var mysql = require('mysql');
require('dotenv').config();

var db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const createList = 'INSERT INTO `lists` SET userID = ? , listName = ?';
const updateList =
  'UPDATE `lists` SET listName = ? WHERE listID = ? AND userID = ?';
const deleteList = 'DELETE FROM `lists` WHERE listID = ? ';

//Create List
exports.createList = (req, res) => {
  console.log(req.user);
  console.log(req.body);
  const user_id = req.user;
  const ListName = req.body.listName;
  db.query(createList, [user_id, ListName], (err, results) => {
    if (err) {
      console.log(err);
      res.status(400).json({
        success: 0,
        error: 'Error while Creating list',
      });
    } else {
      res.status(200).json({
        results,
        success: true,
        message: 'List Created Successfully',
      });
    }
  });
};
//Update List

exports.updateList = (req, res) => {
  console.log(req.user);
  console.log(req.body);
  const user_id = req.user;
  const ListName = req.body.listName;
  db.query(updateList, [ListName, req.params.id, user_id], (err, results) => {
    if (err) {
      console.log(err);
      res.status(400).json({
        success: 0,
        error: 'Error while Updating list',
      });
    } else {
      res.status(200).json({
        results,
        success: true,
        message: 'List Updated Successfully',
      });
    }
  });
};
//Delete List

exports.deleteList = (req, res) => {
  console.log(req.user);
  console.log(req.body);
  const user_id = req.user;
  const ListName = req.body.listName;
  db.query(deleteList, [req.params.id], (err, results) => {
    if (err) {
      res.status(400).json({
        success: 0,
        message: 'Failed to delele the List',
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'List is deleted successfully',
      });
    }
  });
};
