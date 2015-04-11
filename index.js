var irc = require('./irc'),
    argv = require('minimist')(process.argv.slice(2))
    persistence = require('./persistence');


irc.on(/^(.*)$/, persistence.save);

irc.start(argv.password);
