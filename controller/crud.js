const request = require('request');
const jwt = require('jsonwebtoken');
var mysql = require('mysql');
const { set } = require('../app');
const { default: axios } = require('axios');
require('dotenv').config();

var db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const token = jwt.sign(
  {
    iss: process.env.ZOOM_API_KEY,
    exp: 1496091964000,
  },
  process.env.ZOOM_SECRET
);

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

exports.createMeeting = (req, res) => {
  const user_id = req.user;
  const { topic, type, start_time, password, agenda, settings } = req.body;
  const option = {
    method: 'POST',
    url: 'https://api.zoom.us/v2/users/14Hr6UgXS5CxxmYpXbitSw/meetings',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: {
      topic: topic,
      type: type,
      start_time: start_time,
      password: password,
      agenda: agenda,
      settings: {
        host_video: settings.host_video,
        participant_video: settings.participant_video,
        join_before_host: settings.join_before_host,
        mute_upon_entry: settings.mute_upon_entry,
        use_pmi: settings.use_pmi,
        approval_type: settings.approval_type,
      },
    },
    json: true,
  };

  const response = request(option, (error, response, body) => {
    if (error) {
      throw new Error(error);
    }
    console.log(body.start_url);
    res.json(body.start_url);
  });
};
