const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
require('dotenv').config();

var db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});
exports.register = (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  var query = 'SELECT email FROM users WHERE email = ?';
  db.query(query, [email], async (error, results) => {
    if (error) {
      res.status(400).json({
        success: 0,
        error: 'Error Occured ',
      });
      console.log(error);
    }
    if (results.length > 0) {
      return res.status(201).json({
        message: 'User with this Email Already exist',
      });
    }
    if (password.length() > 4) {
      let hash_password = await bcrypt.hash(password, 7);
      console.log(hash_password);
    } else {
      return res.status(400).json({
        message: 'password must be greater than 4 digit',
      });
    }
    db.query(
      'INSERT INTO users SET ?',
      {
        name,
        email,
        user_registeredOn: new Date(),
        password: hash_password,
      },
      (error, results) => {
        if (error) {
          res.status(400).json({
            error,
            success: 0,
            message: 'Failed to Register the user',
          });
          console.log(error);
        } else {
          res.status(200).json({
            success: 1,
            message: 'User Registered',
          });
        }
      }
    );
  });
};

exports.login = (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json();
    }
  } catch (error) {
    res.status(400).json({
      error: 'Unknown Error!',
    });
    console.log(error);
  }
  var query = 'SELECT * FROM users WHERE email = ?';
  const getUserData = 'SELECT * FROM users WHERE id = ?';

  db.query(query, [email], async (error, results) => {
    if (results[0] == undefined) {
      res.status(400).json({
        message: 'Invalid Credentials',
      });
    }
    if (!results || !(await bcrypt.compare(password, results[0].password))) {
      res.status(400).json({ message: 'Email or Password Incorrect' });
    } else {
      const id = results[0].id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      db.query(getUserData, [id], async (error, results) => {
        if (error) {
          console.log(error);
          res.status(400).json({
            error: 'Cannot get user Data',
          });
        } else {
          delete results.password;
          console.log('The token is :' + token);
          res.status(200).json({
            user: results,
            token: token,
          });
        }
      });
    }
  });
};
