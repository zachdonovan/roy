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

stamp = function (data) {
  time = moment().format('HH:mm');
  return time + ' - ' + data + '\n';
}

storagePath = function () {
  date = moment().format('YYYY-MM-DD');
  return config.dir + '/' + config.file + date;
}

exports.save = function (data) {
  fs.appendFile(storagePath(), stamp(data), rethrow_errors);
};


module.exports = exports;
