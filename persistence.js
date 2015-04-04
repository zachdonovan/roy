var fs = require('fs'),
    _ = require('lodash'),
    mkdirp = require('mkdirp'),
    config = require('./conf/persist.json'),
    exports = {},
    rethrow_errors;

rethrow_errors = function (err) {
  if (err) {
    throw err;
  }
};

// make sure the desired persistence file exists
mkdirp.sync(config.dir, rethrow_errors);

exports.save = function (data) {
  fs.appendFile(config.dir + '/' + config.file, data + '\n', rethrow_errors);
};


module.exports = exports;
