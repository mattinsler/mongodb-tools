(function() {
  var CompositeStream, Stream,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Stream = require('stream').Stream;

  CompositeStream = (function(_super) {
    __extends(CompositeStream, _super);

    function CompositeStream(streams, opts) {
      var _this = this;
      if (opts == null) {
        opts = {};
      }
      if (!(this instanceof CompositeStream)) {
        return new CompositeStream(streams, opts);
      }
      if (!(Array.isArray(streams) && streams.length > 0)) {
        throw new Error('Must pass a non-zero length array of streams to CompositeStream');
      }
      CompositeStream.__super__.constructor.call(this, opts);
      this._head = streams[0];
      if (streams.length === 1) {
        this._tail = this._head;
      } else {
        this._tail = streams.slice(1).reduce(function(o, s) {
          return o.pipe(s);
        }, this._head);
      }
      ['read', 'setEncoding', 'resume', 'pause', 'pipe', 'unpipe', 'unshift', 'wrap'].forEach(function(method) {
        return _this[method] = _this._tail[method].bind(_this._tail);
      });
      ['readable', 'data', 'end', 'close', 'error'].forEach(function(event) {
        return _this._tail.on(event, _this.emit.bind(_this, event));
      });
      ['write', 'end'].forEach(function(method) {
        return _this[method] = _this._head[method].bind(_this._head);
      });
      ['drain', 'finish', 'pipe', 'unpipe'].forEach(function(event) {
        return _this._tail.on(event, _this.emit.bind(_this, event));
      });
    }

    return CompositeStream;

  })(Stream);

  module.exports = CompositeStream;

}).call(this);
