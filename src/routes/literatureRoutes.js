const express = require('express');
const router = express.Router();

const { isAuth, isAdmin } = require('../middleware/authentication');
const {
  addLiterature,
  getAllLiterature,
  getDetailLiterature,
  getAll,
  getUserLiteratures,
  literatureVerifAdmin,
  getAllFilter,
} = require('../controllers/literature');
// const { upload } = require('../middleware/uploadFile');
const { upload } = require('../middleware/uploadCloudinary');

router.get('/literatures', isAuth, getAll);
router.get('/literature', isAuth, getAllLiterature);
router.get('/my-literatures', isAuth, getUserLiteratures);
router.get('/literature/:literature_id', isAuth, getDetailLiterature);
router.post('/literature', isAuth, upload('literatureUpload'), addLiterature);
router.patch('/literature-verif/:id', isAuth, isAdmin, literatureVerifAdmin);

router.get('/literatures-filter/:status', isAuth, getAllFilter);

module.exports = router;
