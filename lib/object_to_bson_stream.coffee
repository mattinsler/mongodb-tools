{Transform} = require 'stream'
{BSON} = require('bson').BSONPure

class ObjectToBsonStream extends Transform
  constructor: (opts = {}) ->
    return new ObjectToBsonStream(opts) unless @ instanceof ObjectToBsonStream
    
    opts.objectMode = true
    super(opts)
  
  _transform: (chunk, encoding, done) ->
    try
      @push(BSON.serialize(chunk))
    catch err
      return done(err)
    done()

module.exports = ObjectToBsonStream
