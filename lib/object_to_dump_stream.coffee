{Transform} = require 'stream'
MongodbDump = require './mongodb_dump'

class ObjectToDumpStream extends Transform
  constructor: (opts = {}) ->
    return new ObjectToDumpStream(opts) unless @ instanceof ObjectToDumpStream
    
    opts.objectMode = true
    super(opts)
    
  _transform: (chunk, encoding, done) ->
    try
      @push(MongodbDump.to_dump(chunk))
    catch err
      return done(err)
    
    done()

module.exports = ObjectToDumpStream
