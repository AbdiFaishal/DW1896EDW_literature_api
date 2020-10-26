const express = require('express');
const router = express.Router();

const { isAuth } = require('../middleware/authentication');

const {
  getAllCollections,
  addCollection,
  deleteCollection,
} = require('../controllers/collection');

router.get('/collection/:profile_id', isAuth, getAllCollections);
router.post('/collection', isAuth, addCollection);
router.delete('/delete-collection/:id', isAuth, deleteCollection);

module.exports = router;
