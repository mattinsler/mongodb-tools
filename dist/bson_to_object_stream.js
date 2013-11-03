(function() {
  var BSON, BsonToObjectStream, Transform,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transform = require('stream').Transform;

  BSON = require('bson').BSONPure.BSON;

  BsonToObjectStream = (function(_super) {
    __extends(BsonToObjectStream, _super);

    function BsonToObjectStream(opts) {
      if (opts == null) {
        opts = {};
      }
      if (!(this instanceof BsonToObjectStream)) {
        return new BsonToObjectStream(opts);
      }
      opts.objectMode = true;
      BsonToObjectStream.__super__.constructor.call(this, opts);
      this._buffer = new Buffer(0);
    }

    BsonToObjectStream.prototype._transform = function(chunk, encoding, done) {
      var err, offset, parse_opts, size;
      this._buffer = Buffer.concat([this._buffer, chunk]);
      offset = 0;
      parse_opts = {};
      while (true) {
        if (offset + 4 > this._buffer.length) {
          break;
        }
        size = this._buffer.readInt32LE(offset);
        if (offset + size > this._buffer.length) {
          break;
        }
        parse_opts.index = offset;
        try {
          this.push(BSON.deserialize(this._buffer, parse_opts));
        } catch (_error) {
          err = _error;
          return done(err);
        }
        offset += size;
      }
      this._buffer = this._buffer.slice(offset + 1);
      return done();
    };

    return BsonToObjectStream;

  })(Transform);

  module.exports = BsonToObjectStream;

}).call(this);
