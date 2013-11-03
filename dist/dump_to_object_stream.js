(function() {
  var DumpToObjectStream, MongodbDump, Transform,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transform = require('stream').Transform;

  MongodbDump = require('./mongodb_dump');

  DumpToObjectStream = (function(_super) {
    __extends(DumpToObjectStream, _super);

    function DumpToObjectStream(opts) {
      if (opts == null) {
        opts = {};
      }
      if (!(this instanceof DumpToObjectStream)) {
        return new DumpToObjectStream(opts);
      }
      opts.objectMode = true;
      DumpToObjectStream.__super__.constructor.call(this, opts);
    }

    DumpToObjectStream.prototype._transform = function(chunk, encoding, done) {
      var err;
      try {
        this.push(MongodbDump.from_dump(chunk));
      } catch (_error) {
        err = _error;
        return done(err);
      }
      return done();
    };

    return DumpToObjectStream;

  })(Transform);

  module.exports = DumpToObjectStream;

}).call(this);
