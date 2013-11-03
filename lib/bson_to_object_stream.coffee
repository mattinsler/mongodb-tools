{Transform} = require 'stream'
{BSON} = require('bson').BSONPure

class BsonToObjectStream extends Transform
  constructor: (opts = {}) ->
    return new BsonToObjectStream(opts) unless @ instanceof BsonToObjectStream
    
    opts.objectMode = true
    super(opts)
    
    @_buffer = new Buffer(0)
    
  _transform: (chunk, encoding, done) ->
    @_buffer = Buffer.concat([@_buffer, chunk])
    
    offset = 0
    parse_opts = {}
    while true
      break if offset + 4 > @_buffer.length
      
      size = @_buffer.readInt32LE(offset)
      break if offset + size > @_buffer.length
      
      parse_opts.index = offset
      try
        @push(BSON.deserialize(@_buffer, parse_opts))
      catch err
        return done(err)
      offset += size
    
    @_buffer = @_buffer.slice(offset + 1)
    done()

module.exports = BsonToObjectStream
