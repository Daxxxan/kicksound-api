'use strict';

module.exports = function(Playlist) {
  Playlist.getMusicsFromPlaylist = function(id, cb) {
    Playlist.findById(id, {
      include: {
        relation: 'musics',
        scope: {
          include: ['account', 'accountWhoLike'],
        },
      },
    },
      function(err, instance) {
        let result = [];
        instance = instance.toJSON();
        for (let i = 0; i < instance.musics.length; i++) {
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
