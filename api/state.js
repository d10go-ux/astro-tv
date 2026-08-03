const updateHandler = require('./update.js');

module.exports = (req, res) => {
  req.method = 'GET';
  return updateHandler(req, res);
};
