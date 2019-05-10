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
    'Report',
    'Music',
    'Playlist',
    'Album',
    'Comment',
    'PlaylistMusic',
    'Subscribe',
    'Highlight',
    'Promote',
    'Mark',
  ];

  ds.setMaxListeners(Infinity);

  ds.autoupdate(models, function(err) {
	if (err) throw err;
	console.log('Tables [' + models + '] created in ', ds.adapter.name);
  });
};
