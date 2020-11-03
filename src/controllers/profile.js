const { Literature, User } = require('../../models');

exports.getProfileDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password', 'role', 'avatar'],
      },
    });

    if (!user) {
      return res.status(404).send({
        error: {
          message: `User profile with id of ${id} does not exist`,
        },
      });
    }

    res.send({
      message: 'Fetching profile detail is success',
      data: user,
    });
    console.log('user: ', user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: {
        message: err.message,
      },
    });
  }
};

exports.getAllLiteratures = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('params: ', req.params);
    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).send({
        error: {
          message: `User with id of ${id} does not exist`,
        },
      });
    }

    const literatures = await Literature.findAll({
      where: {
        userId: id,
      },
      include: {
        model: User,
        as: 'user',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password', 'role', 'avatar'],
        },
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId'],
      },
    });

    res.send({
      message: 'Fetching all literatures is success',
      data: literatures,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.changePhotoProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const avatarFile = req.file;

    // console.log('avatar: ', avatarFile);
    // const url = req.protocol + '://' + req.get('host');
    const user = await User.update(
      {
        avatar: avatarFile.path,
      },
      {
        where: {
          id,
        },
      }
    );

    if (user[0]) {
      const user = await User.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password', 'role'],
        },
      });
      res.send({
        message: 'Photo profile has been successfully uploaded',
        data: user,
      });
    } else {
      res.status(404).send({
        error: {
          message: `User with id of ${id} does not exist`,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
