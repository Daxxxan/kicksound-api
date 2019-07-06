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

  Account.getFavoriteMusicsAndOwner = function(id, cb) {
    Account.findById(id, {include: {
      relation: 'favoriteMusics',
      scope: {
        include: ['account', 'accountWhoLike', 'marks'],
      },
    },
    },
      function(err, instance) {
        let result = [];
        let markAverage;

        instance = instance.toJSON();

        for (let i = 0; i < instance.favoriteMusics.length; i++) {
          markAverage = 0;
          for (let k = 0; k < instance.favoriteMusics[i].marks.length; k++) {
            markAverage += instance.favoriteMusics[i].marks[k].value;
          }
          if (instance.favoriteMusics[i].marks.length !== 0) {
            instance.favoriteMusics[i].mark =
              markAverage / instance.favoriteMusics[i].marks.length;
          } else {
            instance.favoriteMusics[i].mark = markAverage;
          }

          for (let j = 0; j < instance.favoriteMusics[i].accountWhoLike.length;
               j++) {
            if (instance.favoriteMusics[i].accountWhoLike[j].id !==
              id) {
              instance.favoriteMusics[i].accountWhoLike.splice(j, 1);
            }
          }
          result.push(instance.favoriteMusics[i]);
        }
        cb(null, result);
      });
  };

  Account.remoteMethod('getFavoriteMusicsAndOwner', {
    accepts: {arg: 'id', type: 'number', http: {source: 'path'},
      required: true, description: 'User ID'},
    returns: {type: 'array', root: 'true'},
    http: {path: '/:id/favoriteMusicsAndOwner', verb: 'get'},
    description: 'Get all user\'s favorites musics',
  });

  Account.getUnknownArtistsByArtistFollowed = function(id, cb) {
    Account.findById(id, {include: {
      relation: 'following',
      scope: {
        include: 'highlight',
      },
    },
    },
      function(err, instance) {
        let result = [];

        instance = instance.toJSON();

        for (let i = 0; i < instance.following.length; i++) {
          if (instance.following[i].type === 2) {
            console.log(instance.following[i].highlight);
            if (instance.following[i].highlight !== undefined) {
              for (let j = 0; j < instance.following[i].highlight.length; j++) {
                result.push(instance.following[i].highlight[j]);
              }
            }
          }
        }
        cb(null, result);
      });
  };

  Account.remoteMethod('getUnknownArtistsByArtistFollowed', {
    accepts: {arg: 'id', type: 'number', http: {source: 'path'},
      required: true, description: 'User ID'},
    returns: {type: 'array', root: 'true'},
    http: {path: '/:id/unknownArtistsByArtistFollowed', verb: 'get'},
    description: 'Get all the unknown artists that are highlight by artist',
  });
};
