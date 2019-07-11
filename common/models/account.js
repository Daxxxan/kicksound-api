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

  Account.rgpd = function(id, cb) {
    Account.findById(id, {
      include: ['events', 'tickets', 'playlists',
        'artistMusic', 'favoriteMusics',
        'highlight', 'highlighted', 'followers', 'following'],
    },
      function(err, instance) {
        cb(null, instance);
      });
  };

  Account.remoteMethod('rgpd', {
    accepts: {arg: 'id', type: 'number', http: {source: 'path'},
      required: true, description: 'User ID'},
    returns: {type: 'array', root: 'true'},
    http: {path: '/:id/RGPD', verb: 'get'},
    description: 'RGPD',
  });

  Account.deleteModel = function(Model, ctx) {
    Model.find({
      where: {
        accountId: ctx.where.id,
      },
    }, function(err, res) {
      res.forEach(function(model) {
        Model.destroyById(model.id, function() {
        });
      });
    });
  };

  Account.deleteSubscribe = function(Model, ctx) {
    Model.find({
      where: {
        followerId: ctx.where.id,
      },
    }, function(err, res) {
      res.forEach(function(model) {
        Model.destroyById(model.id, function() {
        });
      });
    });

    Model.find({
      where: {
        followeeId: ctx.where.id,
      },
    }, function(err, res) {
      res.forEach(function(model) {
        Model.destroyById(model.id, function() {
        });
      });
    });
  };

  Account.deleteHighlight = function(Model, ctx) {
    Model.find({
      where: {
        highlightId: ctx.where.id,
      },
    }, function(err, res) {
      res.forEach(function(model) {
        Model.destroyById(model.id, function() {
        });
      });
    });

    Model.find({
      where: {
        highlightedId: ctx.where.id,
      },
    }, function(err, res) {
      res.forEach(function(model) {
        Model.destroyById(model.id, function() {
        });
      });
    });
  };

  Account.observe('before delete', function(ctx, next) {
    let Event = ctx.Model.app.models.Event;
    let Ticket = ctx.Model.app.models.Ticket;
    let Playlist = ctx.Model.app.models.Playlist;
    let Music = ctx.Model.app.models.Music;
    let Favorite = ctx.Model.app.models.favorite;
    let Highlight = ctx.Model.app.models.Highlight;
    let Subscribe = ctx.Model.app.models.Subscribe;

    Account.deleteModel(Event, ctx);
    Account.deleteModel(Ticket, ctx);
    Account.deleteModel(Playlist, ctx);
    Account.deleteModel(Music, ctx);
    Account.deleteModel(Favorite, ctx);
    Account.deleteHighlight(Highlight, ctx);
    Account.deleteSubscribe(Subscribe, ctx);

    next();
  });
};
