var express = require('express');
var router = express.Router();

var scmapi = require('../controllers/scmapiController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/getfileversion')
.post(scmapi.getfileversion);

router.route('/stopIIS')
.get(scmapi.stopIIS);

router.route('/startIIS')
.get(scmapi.startIIS);

router.route('/resetIIS')
.get(scmapi.resetIIS);

router.route('/copyFile')
.post(scmapi.copyFile);

router.route('/copyFolder')
.post(scmapi.copyFolder);

router.route('/clearFolder')
.post(scmapi.clearFolder);

module.exports = router;
