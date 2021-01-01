var express = require('express');
var router = express.Router();
const crudController = require('../controller/crud');
const { checkToken } = require('../controller/token_verification');

router.post('/createList', checkToken, crudController.createList);

router.post('/updateList/:id', checkToken, crudController.updateList);

router.delete('/deleteList/:id', checkToken, crudController.deleteList);

router.post('/createMeeting', crudController.createMeeting);
module.exports = router;
