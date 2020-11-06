const { User } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtkey = process.env.JWT_KEY;
const joi = require('@hapi/joi');

exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });

    res.send({
      message: 'User Valid',
      data: { user },
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

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const schema = joi.object({
      email: joi.string().email().min(6).email().required(),
      password: joi.string().min(6).required(),
      fullName: joi.string().min(3).required().messages({
        'string.empty': `"Full Name" is not allowed to be empty`,
        'string.min': `"Full Name" should have a minimum length of {#limit}`,
        'any.required': `"Full Name" is not allowed to be empty`,
      }),
      gender: joi.string().required().messages({
        'string.empty': `"Gender" is not allowed to be empty`,
        'any.required': `"Gender" is not allowed to be empty`,
      }),
      phone: joi.number().min(10).required().messages({
        'number.empty': `"Phone" is not allowed to be empty`,
        'number.base': `"Phone" must be a number`,
        'number.min': `"Phone" should have a minimum length of {#limit}`,
        'any.required': `"Phone" is not allowed to be empty`,
      }),
      address: joi.string().required().messages({
        'string.empty': `"Address" is not allowed to be empty`,
        // 'string.base': `"Address" must be a number`,
        // 'string.min': `"Address" should have a minimum length of {#limit}`,
        'any.required': `"Address" is not allowed to be empty`,
      }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.status(400).send({
        error: {
          message: 'This email is already registered.',
        },
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtkey
    );

    res.send({
      message: 'Your new account has been created successfully',
      data: {
        email: user.email,
        token,
      },
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = joi.object({
      email: joi.string().email().min(6).email().required(),
      password: joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).send({
        error: {
          message: 'Incorrect email or password.',
        },
      });
    }

    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return res.status(401).send({
        error: {
          message: 'Incorrect email or password.',
        },
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtkey
    );
    res.send({
      message: 'Login Success',
      data: {
        email: user.email,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: err.message,
      },
    });
  }
};
