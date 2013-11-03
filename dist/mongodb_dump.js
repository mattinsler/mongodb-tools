(function() {
  var bson, from_dump, from_regex, to_dump, to_regex, util;

  util = require('util');

  bson = require('bson').BSONPure;

  from_regex = function(o) {
    var opts;
    opts = '';
    if (o.global) {
      opts += 'g';
    }
    if (o.ignoreCase) {
      opts += 'i';
    }
    if (o.multiline) {
      opts += 'm';
    }
    if (o.sticky) {
      opts += 'y';
    }
    if (opts !== '') {
      return [o.source, opts];
    }
    return o.source;
  };

  to_regex = function(o) {
    if (Array.isArray(o)) {
      return new RegExp(o[0], o[1]);
    }
    return new RegExp(o);
  };

  to_dump = function(o) {
    var _ref;
    if ((_ref = typeof o) === 'number' || _ref === 'string' || _ref === 'boolean' || _ref === 'undefined') {
      return o;
    }
    if (util.isArray(o)) {
      return o.map(to_dump);
    }
    if (util.isDate(o)) {
      return {
        $date: o.toISOString()
      };
    }
    if (util.isRegExp(o)) {
      return {
        $regex: from_regex(o)
      };
    }
    if (o instanceof bson.ObjectID || o._bsontype === 'ObjectID') {
      return {
        $oid: o.toHexString()
      };
    }
    if (o instanceof bson.Long) {
      return {
        $long: o.toString()
      };
    }
    return Object.keys(o).reduce(function(res, k) {
      res[k] = to_dump(o[k]);
      return res;
    }, {});
  };

  from_dump = function(o) {
    var keys, _ref;
    if ((_ref = typeof o) === 'number' || _ref === 'string' || _ref === 'boolean') {
      return o;
    }
    if (Array.isArray(o)) {
      return o.map(from_dump);
    }
    keys = Object.keys(o);
    if (keys.length === 1 && keys[0][0] === '$') {
      if (o.$date != null) {
        return new Date(o.$date);
      }
      if (o.$regex != null) {
        return new to_regex(o.$regex);
      }
      if (o.$oid != null) {
        return bson.ObjectID.createFromHexString(o.$oid);
      }
      if (o.$long != null) {
        return bson.Long.fromString(o.$long);
      }
    }
    return keys.reduce(function(res, k) {
      res[k] = from_dump(o[k]);
      return res;
    }, {});
  };

  exports.to_dump = to_dump;

  exports.from_dump = from_dump;

}).call(this);
