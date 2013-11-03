(function() {
  var BSON, ObjectToBsonStream, Transform,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transform = require('stream').Transform;

  BSON = require('bson').BSONPure.BSON;

  ObjectToBsonStream = (function(_super) {
    __extends(ObjectToBsonStream, _super);

    function ObjectToBsonStream(opts) {
      if (opts == null) {
        opts = {};
      }
      if (!(this instanceof ObjectToBsonStream)) {
        return new ObjectToBsonStream(opts);
      }
      opts.objectMode = true;
      ObjectToBsonStream.__super__.constructor.call(this, opts);
    }

    ObjectToBsonStream.prototype._transform = function(chunk, encoding, done) {
      var err;
      try {
        this.push(BSON.serialize(chunk));
      } catch (_error) {
        err = _error;
        return done(err);
      }
      return done();
    };

    return ObjectToBsonStream;

  })(Transform);

  module.exports = ObjectToBsonStream;

}).call(this);
