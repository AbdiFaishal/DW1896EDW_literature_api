const jwt = require('jsonwebtoken');
const jwtkey = process.env.JWT_KEY;
const { User } = require('../../models');

exports.isAuth = (req, res, next) => {
  let header, token;

  if (
    !(header = req.header('Authorization')) ||
    !(token = header.replace('Bearer ', ''))
  ) {
    return res.status(401).send({
      error: {
        message: 'Access Denied',
      },
    });
  }

  try {
    const verified = jwt.verify(token, jwtkey);
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({
      error: {
        message: 'Invalid Token',
      },
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    console.log('user admin: ', user.role);
    if (user.role !== 'admin') {
      return res.status(401).send({
        error: {
          message: 'You are unauthorized',
        },
      });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({
      error: {
        message: 'Invalid Token',
      },
    });
  }
};
