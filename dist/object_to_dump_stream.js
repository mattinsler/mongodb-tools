(function() {
  var MongodbDump, ObjectToDumpStream, Transform,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transform = require('stream').Transform;

  MongodbDump = require('./mongodb_dump');

  ObjectToDumpStream = (function(_super) {
    __extends(ObjectToDumpStream, _super);

    function ObjectToDumpStream(opts) {
      if (opts == null) {
        opts = {};
      }
      if (!(this instanceof ObjectToDumpStream)) {
        return new ObjectToDumpStream(opts);
      }
      opts.objectMode = true;
      ObjectToDumpStream.__super__.constructor.call(this, opts);
    }

    ObjectToDumpStream.prototype._transform = function(chunk, encoding, done) {
      var err;
      try {
        this.push(MongodbDump.to_dump(chunk));
      } catch (_error) {
        err = _error;
        return done(err);
      }
      return done();
    };

    return ObjectToDumpStream;

  })(Transform);

  module.exports = ObjectToDumpStream;

}).call(this);
