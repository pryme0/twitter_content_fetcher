var express = require('express');
var router = express.Router();
const asyncHandler = require('../utilities/asyncHandler')
const TwitterService = require('../Services/TwitterService')
const userController = require('../controllers/userController')


/* GET home page. */
router.get('/', asyncHandler(function(req, res, next) {
    res.render('index', { title: 'Express' });
}));

//facbook signup route
router.get('/twitter',userController.twitter);

//twitter authentication callback url
router.get('/twittercallback',userController.twitterCallback);

router.get('/dashboard',userController.dashboard);

router.get('/getInterest',userController.getInterests);

router.post('/updateinterest',userController.updateInterest);

router.get('/logout',userController.logout);

router.get('/deleteInterest/:interest',userController.deleteInterests);
router.get('/getuserContent',userController.getUserContent);


module.exports = router;