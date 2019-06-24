'use strict';

module.exports = function(Music) {
  Music.getMusicByArtist = function(id, cb) {
    Music.find({where: {accountId: id}, include: ['account',
      'accountWhoLike']},
      function(err, instance) {
        cb(null, instance);
      });
  };

  Music.remoteMethod('getMusicByArtist', {
    accepts: {arg: 'id', type: 'number', http: {source: 'path'},
      required: true, description: 'User ID'},
    returns: {type: 'array', root: 'true'},
    http: {path: '/musicByArtist/:id', verb: 'get'},
    description: 'Get all musics of an artist',
  });
};
