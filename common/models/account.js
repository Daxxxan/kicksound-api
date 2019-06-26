'use strict';

module.exports = function(Account) {
  Account.getEventParticipation = function(id, cb) {
    Account.findById(id, {include: {tickets: 'event'}},
      function(err, instance) {
        let result = [];
        for (let counter = 0; counter < instance.tickets().length; counter++) {
          result.push(instance.tickets()[counter].event());
        }
        cb(null, result);
      });
  };

  Account.remoteMethod('getEventParticipation', {
    accepts: {arg: 'id', type: 'number', http: {source: 'path'},
      required: true, description: 'User ID'},
    returns: {type: 'array', root: 'true'},
    http: {path: '/:id/eventParticipation', verb: 'get'},
    description: 'Get all events which user participate',
  });

  Account.getEventByFollowedUser = function(id, cb) {
    Account.findById(id, {include: {following: ['events']}},
      function(err, instance) {
        let result = [];
        for (let i = 0; i < instance.following().length; i++) {
          for (let j = 0; j < instance.following()[i].events().length; j++) {
            result.push(instance.following()[i].events()[j]);
          }
        }
        cb(null, result);
      });
  };

  Account.remoteMethod('getEventByFollowedUser', {
    accepts: {arg: 'id', type: 'number', http: {source: 'path'},
      required: true, description: 'User ID'},
    returns: {type: 'array', root: 'true'},
    http: {path: '/:id/eventByFollowedUser', verb: 'get'},
    description: 'Get all events by followed users',
  });

  Account.getFavoriteMusicsAndOwner = function(id, loggedUser, cb) {
    Account.findById(id, {include: {
      relation: 'favoriteMusics',
      scope: {
        include: ['account', 'accountWhoLike'],
      },
    },
    },
      function(err, instance) {
        let result = [];
        instance = instance.toJSON();
        for (let i = 0; i < instance.favoriteMusics.length; i++) {
          for (let j = 0; j < instance.favoriteMusics[i].accountWhoLike.length;
               j++) {
            if (instance.favoriteMusics[i].accountWhoLike[j].id !==
              loggedUser) {
              instance.favoriteMusics[i].accountWhoLike.splice(j, 1);
            }
          }
          result.push(instance.favoriteMusics[i]);
        }
        cb(null, result);
      });
  };

  Account.remoteMethod('getFavoriteMusicsAndOwner', {
    accepts: [
      {arg: 'id', type: 'number', http: {source: 'path'},
        required: true, description: 'User ID'},
      {arg: 'loggedUser', type: 'number', http: {source: 'path'},
        required: true, description: 'User ID'},
    ],
    returns: {type: 'array', root: 'true'},
    http: {path: '/:id/favoriteMusicsAndOwner/:loggedUser', verb: 'get'},
    description: 'Get all user\'s favorites musics',
  });
};
