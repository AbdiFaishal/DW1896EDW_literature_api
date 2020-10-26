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
} = require('../controllers/literature');
const { upload } = require('../middleware/uploadFile');

router.get('/literatures', isAuth, getAll);
router.get('/literature', isAuth, getAllLiterature);
router.get('/my-literatures', isAuth, getUserLiteratures);
router.get('/literature/:literature_id', isAuth, getDetailLiterature);
router.post('/literature', isAuth, upload('attache'), addLiterature);
router.patch('/literature-verif/:id', isAuth, isAdmin, literatureVerifAdmin);

module.exports = router;
