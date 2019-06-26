'use strict';

module.exports = function(Music) {
  Music.getMusicByArtist = function(id, loggedUser, cb) {
    Music.find({where: {accountId: id}, include: ['account', 'accountWhoLike']},
      function(err, instance) {
        instance = instance.map((i) => i.toJSON());
        for (let i = 0; i < instance.length; i++) {
          for (let j = 0; j < instance[i].accountWhoLike.length; j++) {
            if (instance[i].accountWhoLike[j].id !== loggedUser) {
              instance[i].accountWhoLike.splice(j, 1);
            }
          }
        }
        cb(null, instance);
      });
  };

  Music.remoteMethod('getMusicByArtist', {
    accepts: [
      {arg: 'id', type: 'number', http: {source: 'path'},
        required: true, description: 'User ID'},
      {arg: 'loggedUser', type: 'number', http: {source: 'path'},
        required: true, description: 'User ID'},
    ],
    returns: {type: 'array', root: 'true'},
    http: {path: '/musicByArtist/:id/:loggedUser', verb: 'get'},
    description: 'Get all musics of an artist',
  });
};
