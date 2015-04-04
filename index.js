var irc = require('./irc'),
    persistence = require('./persistence');


irc.on(/^(.*)$/, persistence.save);

irc.start();
