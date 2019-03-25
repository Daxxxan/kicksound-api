'use strict';

module.exports = function enableAuthentication(server) {
  const ds = server.dataSources.mysql;

  const models = [
    'ACL',
    'AccessToken',
    'Account',
    'Event',
    'Ticket',
    'Request',
    'Live',
    'Photo',
    'Report',
    'Music',
    'Playlist',
    'Album',
    'Comment',
    'PlaylistMusic',
    'MusicAccount',
  ];

  ds.setMaxListeners(Infinity);

  ds.autoupdate(models, function(err) {
    if (err) throw err;
    console.log('Tables [' + models + '] created in ', ds.adapter.name);
  });
};
