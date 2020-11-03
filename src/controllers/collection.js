const { Collection, Literature, User } = require('../../models');

exports.getAllCollections = async (req, res) => {
  try {
    const { profile_id } = req.params;
    console.log('profile_id: ', profile_id);
    const collections = await Collection.findAll({
      where: {
        userId: profile_id,
      },
      include: [
        {
          model: Literature,
          as: 'literature',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'status', 'userId'],
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: {
                exclude: [
                  'createdAt',
                  'updatedAt',
                  'password',
                  'role',
                  'avatar',
                ],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ['userId', 'literatureId', 'createdAt', 'updatedAt'],
      },
    });

    console.log('col: ', collections);
    if (!collections.length) {
      return res.status(404).send({
        error: {
          message: `User with id of ${profile_id} does not have any collections`,
        },
      });
    }
    res.send({
      message: 'Fetching all collections is success',
      data: collections,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

exports.addCollection = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.user.id;
    const literatureId = req.body.literatureId;

    const collection = await Collection.create({
      userId,
      literatureId,
    });
    console.log('add collection: ', collection);
    res.send({
      message: 'New collection has been successfully added',
      data: collection,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: err.message,
    });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    console.log('params', req.params);

    const collection = await Collection.destroy({
      where: {
        id,
      },
    });
    if (!collection) {
      return res.status(404).send({
        error: {
          message: 'Collection does not exist',
        },
      });
    }

    res.send({
      message: 'Collection has been successfully deleted',
    });
    console.log('delete collection: ', collection);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: {
        message: err.message,
      },
    });
  }
};
