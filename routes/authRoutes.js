const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController')


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/social-login', authController.socialLogin);
router.get('/captcha', authController.getCaptcha);
router.post('/reset-password-dob', authController.resetPasswordWithDOB);
router.post('/update-profile-pic', userController.updateProfilePic);
router.post('/update-profile-name', userController.updateProfileName);
router.post('/update-phone', userController.updatePhone);
router.post('/update-dob', userController.updateProfileDOB);
router.post('/update-gender', userController.updateProfileGender);
router.post('/update-password', userController.updatePassword)
router.post('/update-newsletter', userController.updateNewsletter)
router.post('/delete-account', authController.deleteAccount)

module.exports = router;

