'use strict';

module.exports = function(Music) {
  Music.getMusicByArtist = function(id, loggedUser, cb) {
    Music.find({where: {accountId: id}, include:
          ['account', 'accountWhoLike', 'marks']},
      function(err, instance) {
        instance = instance.map((i) => i.toJSON());
        let markAverage;

        for (let i = 0; i < instance.length; i++) {
          markAverage = 0;
          for (let k = 0; k < instance[i].marks.length; k++) {
            markAverage += instance[i].marks[k].value;
          }
          if (instance[i].marks.length !== 0) {
            instance[i].mark =
              markAverage / instance[i].marks.length;
          } else {
            instance[i].mark = markAverage;
          }

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

  Music.getMusicByKind = function(id, loggedUser, cb) {
    Music.find({where: {musicKindId: id}, include:
          ['account', 'accountWhoLike', 'marks']},
      function(err, instance) {
        instance = instance.map((i) => i.toJSON());
        let markAverage;

        for (let i = 0; i < instance.length; i++) {
          markAverage = 0;
          for (let k = 0; k < instance[i].marks.length; k++) {
            markAverage += instance[i].marks[k].value;
          }
          if (instance[i].marks.length !== 0) {
            instance[i].mark =
              markAverage / instance[i].marks.length;
          } else {
            instance[i].mark = markAverage;
          }

          for (let j = 0; j < instance[i].accountWhoLike.length; j++) {
            if (instance[i].accountWhoLike[j].id !== loggedUser) {
              instance[i].accountWhoLike.splice(j, 1);
            }
          }
        }
        cb(null, instance);
      });
  };

  Music.remoteMethod('getMusicByKind', {
    accepts: [
      {arg: 'id', type: 'number', http: {source: 'path'},
        required: true, description: 'MusicKindId ID'},
      {arg: 'loggedUser', type: 'number', http: {source: 'path'},
        required: true, description: 'User ID'},
    ],
    returns: {type: 'array', root: 'true'},
    http: {path: '/musicByKind/:id/:loggedUser', verb: 'get'},
    description: 'Get all musics of an artist',
  });
};
