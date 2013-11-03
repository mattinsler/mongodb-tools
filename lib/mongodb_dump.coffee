util = require 'util'
bson = require('bson').BSONPure

from_regex = (o) ->
  opts = ''
  opts += 'g' if o.global
  opts += 'i' if o.ignoreCase
  opts += 'm' if o.multiline
  opts += 'y' if o.sticky
  return [o.source, opts] unless opts is ''
  o.source

to_regex = (o) ->
  return new RegExp(o[0], o[1]) if Array.isArray(o)
  new RegExp(o)

to_dump = (o) ->
  return o if typeof o in ['number', 'string', 'boolean', 'undefined']
  return o.map(to_dump) if util.isArray(o)
  
  return {$date: o.toISOString()} if util.isDate(o)
  return {$regex: from_regex(o)} if util.isRegExp(o)
  return {$oid: o.toHexString()} if o instanceof bson.ObjectID or o._bsontype is 'ObjectID'
  return {$long: o.toString()} if o instanceof bson.Long
  # bson.Binary -> Buffer
  
  Object.keys(o).reduce (res, k) ->
    res[k] = to_dump(o[k])
    res
  , {}

from_dump = (o) ->
  return o if typeof o in ['number', 'string', 'boolean']
  return o.map(from_dump) if Array.isArray(o)
  
  keys = Object.keys(o)
  if keys.length is 1 and keys[0][0] is '$'
    return new Date(o.$date) if o.$date?
    return new to_regex(o.$regex) if o.$regex?
    return bson.ObjectID.createFromHexString(o.$oid) if o.$oid?
    return bson.Long.fromString(o.$long) if o.$long?
  
  keys.reduce (res, k) ->
    res[k] = from_dump(o[k])
    res
  , {}

exports.to_dump = to_dump
exports.from_dump = from_dump
