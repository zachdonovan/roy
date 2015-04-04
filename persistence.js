var fs = require('fs'),
    config = require('./conf/persist.json')
    exports = {};


exports.save = function (data) {
  fs.appendFile(config.path, data + '\n', function (err) {
    if (err) {
      throw err;
    }
  });
};


module.exports = exports;
