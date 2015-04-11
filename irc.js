/*
 * a simple implementation of an IRC handler
 * by Zachary Donovan
 * largely adapted from: https://gist.github.com/callumacrae/996827
 */

var net = require('net'),
    _ = require('lodash'),
    irc,
    config = require('./conf/irc.json');


irc = {
  socket: new net.Socket(),
  listeners: [],
  config: config
};


irc.socket.on('data', function (data) {

  data = data.split('\n');
  _(data)
  .each(function (datum) { console.log('RECV - ', datum); })
  .filter(function (datum) { return datum !== '' })
  .map(function (datum) { return datum.slice(0, -1); })
  .map(irc.handle)
  .value();

});

irc.socket.on('connect', function () {
  console.log('Establish connection...');
  irc.on(/^PING :(.+)$/i, function (info) {
    info = /^PING :(.+)$/i.exec(info);
    irc.raw('PONG :'+info[1]);
  });

  setTimeout(function () {
    irc.raw('NICK ' + config.user.nick);
    irc.raw('USER ' + config.user.user + ' 8 * :' + config.user.real);
    setTimeout(function () {
      irc.identify(config.user.pass);
      _.map(config.chans, irc.join);
    }, 2000);
  }, 1000);
});

irc.raw = function (data) {
  irc.socket.write(data + '\n', 'ascii', function () { console.log('SENT -', data); });
}

irc.on = function (data, callback) {
  irc.listeners.push([data, callback, false])
}

irc.on_once = function (data, callback) {
  irc.listeners.push([data, callback, true])
}

irc.handle = function (data) {
  var exhaustedListeners = _(irc.listeners)
  .filter(function (listener) { return listener[0].exec(data); })
  .each(function (listener) { listener[1](data); })
  .filter(function (listener) { return listener[2]; })
  .value();

  irc.listeners = _.difference(irc.listeners, exhaustedListeners);
} 

irc.on(/^[^ ]+ 001 ([0-9a-zA-Z`_{|}\-\[\]\^]+) :/, function (info) {
  irc.nick = info[1];
});

irc.identify = function (password) {
  irc.raw('PRIVMSG NickServ : identify ' +  password);
}

irc.join = function (channel) {
  irc.raw('JOIN ' + channel);
}

irc.start = function (password) {
  irc.config.user.pass = password || '';
  irc.socket.setEncoding('ascii');
  irc.socket.setNoDelay();
  irc.socket.connect(config.server.port, config.server.addr);
}

module.exports = irc;
