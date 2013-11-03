{Transform} = require 'stream'
MongodbDump = require './mongodb_dump'

class DumpToObjectStream extends Transform
  constructor: (opts = {}) ->
    return new DumpToObjectStream(opts) unless @ instanceof DumpToObjectStream
    
    opts.objectMode = true
    super(opts)
    
  _transform: (chunk, encoding, done) ->
    try
      @push(MongodbDump.from_dump(chunk))
    catch err
      return done(err)
    
    done()

module.exports = DumpToObjectStream
