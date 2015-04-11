var fs = require('fs'),
    _ = require('lodash'),
    moment = require('moment'),
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
  date = moment.format('YYYY-MM-DD')
  fs.appendFile(config.dir + '/' + config.file + date, data + '\n', rethrow_errors);
};


module.exports = exports;
