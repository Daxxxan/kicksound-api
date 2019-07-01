'use strict';

module.exports = function(Playlist) {
  Playlist.getMusicsFromPlaylist = function(id, cb) {
    Playlist.findById(id, {
      include: {
        relation: 'musics',
        scope: {
          include: ['account', 'accountWhoLike', 'marks'],
        },
      },
    },
      function(err, instance) {
        let result = [];
        let markAverage;

        instance = instance.toJSON();
        for (let i = 0; i < instance.musics.length; i++) {
          markAverage = 0;
          for (let k = 0; k < instance.musics[i].marks.length; k++) {
            markAverage += instance.musics[i].marks[k].value;
          }
          if (instance.musics[i].marks.length !== 0) {
            instance.musics[i].mark =
              markAverage / instance.musics[i].marks.length;
          } else {
            instance.musics[i].mark = markAverage;
          }
          result.push(instance.musics[i]);
        }
        cb(null, result);
      });
  };

  Playlist.remoteMethod('getMusicsFromPlaylist', {
    accepts: {arg: 'id', type: 'number', http: {source: 'path'},
      required: true, description: 'Playlist ID'},
    returns: {type: 'array', root: 'true'},
    http: {path: '/:id/musicWithArtist', verb: 'get'},
    description: 'Get all musics from a playlist',
  });
};
