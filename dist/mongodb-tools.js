(function() {
  var ChangeEncodingStream, CompositeStream, JsonStream, PassThrough, Readable, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('stream'), Readable = _ref.Readable, PassThrough = _ref.PassThrough;

  JsonStream = require('JSONStream');

  CompositeStream = require('./composite-stream');

  exports.BsonToObjectStream = require('./bson_to_object_stream');

  exports.ObjectToDumpStream = require('./object_to_dump_stream');

  exports.DumpToObjectStream = require('./dump_to_object_stream');

  exports.ObjectToBsonStream = require('./object_to_bson_stream');

  exports.MongodbDump = require('./mongodb_dump');

  ChangeEncodingStream = (function(_super) {
    __extends(ChangeEncodingStream, _super);

    function ChangeEncodingStream(encoding) {
      if (!(this instanceof ChangeEncodingStream)) {
        return new ChangeEncodingStream(encoding);
      }
      ChangeEncodingStream.__super__.constructor.call(this);
      this.setEncoding(encoding);
    }

    return ChangeEncodingStream;

  })(PassThrough);

  exports.createBsonToObjectStream = function() {
    return exports.BsonToObjectStream();
  };

  exports.createBsonToDumpStream = function() {
    return new CompositeStream([exports.BsonToObjectStream(), exports.ObjectToDumpStream()]);
  };

  exports.createBsonToJsonStream = function() {
    return new CompositeStream([exports.BsonToObjectStream(), exports.ObjectToDumpStream(), new Readable().wrap(JsonStream.stringify(false)), ChangeEncodingStream('utf8')]);
  };

  exports.createJsonToBsonStream = function() {
    return new CompositeStream([ChangeEncodingStream('utf8'), JsonStream.parse(), exports.DumpToObjectStream(), exports.ObjectToBsonStream()]);
  };

  exports.createJsonToObjectStream = function() {
    return new CompositeStream([ChangeEncodingStream('utf8'), JsonStream.parse(), exports.DumpToObjectStream()]);
  };

  exports.createObjectToBsonStream = function() {
    return exports.ObjectToBsonStream();
  };

}).call(this);
