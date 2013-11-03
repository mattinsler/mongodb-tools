{Stream} = require 'stream'

class CompositeStream extends Stream
  constructor: (streams, opts = {}) ->
    return new CompositeStream(streams, opts) unless @ instanceof CompositeStream
    throw new Error('Must pass a non-zero length array of streams to CompositeStream') unless Array.isArray(streams) and streams.length > 0
    super(opts)
    
    @_head = streams[0]
    if streams.length is 1
      @_tail = @_head
    else
      @_tail = streams.slice(1).reduce (o, s) ->
        o.pipe(s)
      , @_head
    
    # Readable Methods
    # read, setEncoding, resume, pause, pipe, unpipe, unshift, wrap
    ['read', 'setEncoding', 'resume', 'pause', 'pipe', 'unpipe', 'unshift', 'wrap'].forEach (method) =>
      @[method] = @_tail[method].bind(@_tail)
    
    # Readable Events
    # readable, data, end, close, error
    ['readable', 'data', 'end', 'close', 'error'].forEach (event) =>
      @_tail.on(event, @emit.bind(@, event))
    
    # Writable Methods
    ['write', 'end'].forEach (method) =>
      @[method] = @_head[method].bind(@_head)
    
    # Writable Events
    ['drain', 'finish', 'pipe', 'unpipe'].forEach (event) =>
      @_tail.on(event, @emit.bind(@, event))

module.exports = CompositeStream
