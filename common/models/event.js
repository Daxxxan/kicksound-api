'use strict';

module.exports = function(Event) {
  Event.getEventParticipants = function(id, cb) {
    Event.findById(id, {include: {tickets: 'account'}},
      function(err, instance) {
        let result = [];
        for (let counter = 0; counter < instance.tickets().length; counter++) {
          result.push(instance.tickets()[counter].account());
        }
        cb(null, result);
      });
  };

  Event.remoteMethod('getEventParticipants', {
    accepts: {arg: 'id', type: 'number', http: {source: 'path'},
      required: true, description: 'Event ID'},
    returns: {type: 'array', root: 'true'},
    http: {path: '/:id/participants', verb: 'get'},
    description: 'Get all event\'s accounts',
  });
};
