{Readable, PassThrough} = require 'stream'
JsonStream = require 'JSONStream'
CompositeStream = require './composite-stream'

exports.BsonToObjectStream = require './bson_to_object_stream'
exports.ObjectToDumpStream = require './object_to_dump_stream'

exports.DumpToObjectStream = require './dump_to_object_stream'
exports.ObjectToBsonStream = require './object_to_bson_stream'

exports.MongodbDump = require './mongodb_dump'

class ChangeEncodingStream extends PassThrough
  constructor: (encoding) ->
    return new ChangeEncodingStream(encoding) unless @ instanceof ChangeEncodingStream
    super()
    @setEncoding(encoding)

exports.createBsonToObjectStream = ->
  exports.BsonToObjectStream()
exports.createBsonToDumpStream = ->
  new CompositeStream([
    exports.BsonToObjectStream(),
    exports.ObjectToDumpStream()
  ])
exports.createBsonToJsonStream = ->
  new CompositeStream([
    exports.BsonToObjectStream(),
    exports.ObjectToDumpStream(),
    new Readable().wrap(JsonStream.stringify(false))
    ChangeEncodingStream('utf8')
  ])

exports.createJsonToBsonStream = ->
  new CompositeStream([
    ChangeEncodingStream('utf8'),
    JsonStream.parse(),
    exports.DumpToObjectStream(),
    exports.ObjectToBsonStream()
  ])
exports.createJsonToObjectStream = ->
  new CompositeStream([
    ChangeEncodingStream('utf8'),
    JsonStream.parse(),
    exports.DumpToObjectStream()
  ])
exports.createJsonToDumpStream = ->
  new CompositeStream([
    ChangeEncodingStream('utf8'),
    JsonStream.parse()
  ])
exports.createObjectToBsonStream = ->
  exports.ObjectToBsonStream()
