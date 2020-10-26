const { Literature, User } = require('../../models');
const { Op } = require('sequelize');
const joi = require('@hapi/joi');

const literatureResponse = async (id) => {
  try {
    return await Literature.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
          },
        },
      ],
      attributes: {
        exclude: ['userId', 'UserId', 'createdAt', 'updatedAt'],
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAll = async (req, res) => {
  try {
    const { title, public_year } = req.query;
    console.log('title: ', title);

    const literatures = await Literature.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'role', 'avatar'],
          },
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId'],
      },
    });

    console.log('literatures: ', literatures);

    if (!literatures.length) {
      return res.status(404).send({
        error: {
          message,
        },
      });
    }

    res.send({
      message: `Fetching all literature is success`,
      data: literatures,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAllLiterature = async (req, res) => {
  try {
    const { title, year } = req.query;
    console.log('req query: ', req.query);

    let searchData = {};
    let message = '';
    if (title) {
      searchData = {
        status: 'approved',
        title: {
          [Op.substring]: title,
        },
      };
      message = `Literature with title of '${title}' does not exist`;
    } else {
      searchData = {
        status: 'approved',
        publication_date: {
          [Op.substring]: year,
        },
      };
      // searchData = {
      //   [Op.and]: [
      //     {
      //       status: 'approved',
      //       title: {
      //         [Op.substring]: title,
      //       },
      //     },
      //     {
      //       status: 'approved',
      //       publication_date: {
      //         [Op.substring]: year,
      //       },
      //     },
      //   ],
      // };
      message = `Literature with publication year of '${year}' does not exist`;
    }
    const literatures = await Literature.findAll({
      where: searchData,
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'role', 'avatar'],
          },
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId'],
      },
    });

    console.log('literatures: ', literatures);

    if (!literatures.length) {
      return res.status(404).send({
        error: {
          message,
        },
      });
    }

    res.send({
      message: `Fetching all literature is success`,
      data: literatures,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: {
        message: err.message,
      },
    });
  }
};

exports.getUserLiteratures = async (req, res) => {
  try {
    const userId = req.user.id;
    const literatures = await Literature.findAll({
      where: {
        userId,
        status: { [Op.ne]: ['canceled'] },
      },
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt', 'role'],
          },
        },
      ],
    });

    res.send({
      message: 'Fetching all literatures owned by user owned is success',
      data: literatures,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getDetailLiterature = async (req, res) => {
  try {
    const { literature_id } = req.params;

    console.log('id: ', literature_id);

    const literature = await Literature.findOne({
      where: {
        id: literature_id,
      },
      include: {
        model: User,
        as: 'user',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password', 'role', 'avatar'],
        },
      },
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt'],
      },
    });

    if (!literature) {
      return res.status(404).send({
        error: {
          message: `Literature with id of '${literature_id}' does not exist`,
        },
      });
    }

    console.log('detail: ', literature);
    res.send({
      message: 'Fetching detail literature is success',
      data: literature,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

exports.addLiterature = async (req, res) => {
  try {
    // console.log('REQ FILE: ', req.files);
    // console.log('req body: ', req.body);
    const schema = joi.object({
      title: joi.string().min(5).required(),
      publication_date: joi.string().min(5).required(),
      pages: joi.string().required(),
      isbn: joi.string().required(),
      author: joi.string().min(3).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }
    const url = req.protocol + '://' + req.get('host');
    const newLiterature = await Literature.create({
      ...req.body,
      userId: req.user.id,
      attache: `${url}/${req.files.attache[0].path}`,
      image: `${url}/${req.files.image[0].path}`,
    });

    const data = await Literature.findOne({
      where: {
        id: newLiterature.id,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'role', 'avatar'],
          },
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId'],
      },
    });

    res.send({
      message: 'Literature has been successfully added',
      data,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

exports.literatureVerifAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('body: ', req.body.status);
    const literature = await Literature.update(
      {
        status: req.body.status,
      },
      {
        where: {
          id,
        },
      }
    );
    const newLiterature = await literatureResponse(id);

    if (literature[0]) {
      res.send({
        message: 'The literature has been successfully verified',
        data: newLiterature,
      });
    } else {
      res.status(404).send({
        error: {
          message: `Literature with id of ${id} is not found`,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
};
