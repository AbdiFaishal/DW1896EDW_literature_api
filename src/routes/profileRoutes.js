const express = require('express');
const router = express.Router();

const { isAuth } = require('../middleware/authentication');
const {
  getProfileDetail,
  getAllLiteratures,
  changePhotoProfile,
} = require('../controllers/profile');
const { upload } = require('../middleware/uploadFile');

router.get('/profile/:id', isAuth, getProfileDetail);
router.get('/profile/:id/literature', isAuth, getAllLiteratures);
router.patch('/profile/:id', isAuth, upload('avatar'), changePhotoProfile);

module.exports = router;
