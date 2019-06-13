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
};
