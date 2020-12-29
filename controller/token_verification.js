const { verify, decode } = require('jsonwebtoken');
require('dotenv').config();

module.exports.checkToken = (req, res, next) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  let token = req.get('authorization');
  if (token) {
    token = token.slice(7);
    verify(token, process.env.JWT_SECRET, (error, results) => {
      if (error) {
        res.status(401).json({
          success: 0,
          message: 'Invalid Token',
        });
      } else {
        req.user = results.id;
        next();
      }
    });
  } else {
    res.status(401).json({
      success: 0,
      message: 'Access Denied, Unauthorized user',
    });
  }
};
