const validator = require('../validate');
// also stolen from stackoverflow
const signup = (req, res, next) => {
  const validationRule = {
    "username": "required|string",
    "password": "required|string|min:6",
  }
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412)
        .json({
          success: false,
          message: 'Validation failed',
          data: err
        });
    } else {
      next();
    }
  });
}

module.exports = {
  signup
}