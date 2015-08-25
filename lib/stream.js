'use strict';

// MODULES //

var Transform = require( 'readable-stream' ).Transform,
	copy = require( 'utils-copy' ),
	validate = require( './validate.js' ),
	decode = require( './decode.js' );


// VARIABLES //

var DEFAULTS = require( './defaults.json' ),
	RE = /\r?\n/;


// STREAM //

/**
* FUNCTION: Stream( [options] )
*	Transform stream constructor.
*
* @constructor
* @param {Object} [options] - stream options
* @param {Boolean} [options.objectMode=false] - specifies whether stream should operate in object mode
* @param {String|Null} [options.encoding=null] - specifies how Buffer objects should be decoded to `strings`
* @param {Number} [options.highWaterMark=16] - specifies the Buffer level for when `write()` starts returning `false`
* @param {Boolean} [options.allowHalfOpen=false] - specifies whether the stream should remain open even if one side ends
* @param {Boolean} [options.writableObjectMode=false] - specifies whether the writable side should be in object mode
* @returns {Stream} Transform stream
*/
function Stream( options ) {
	var opts,
		err;

	if ( !( this instanceof Stream ) ) {
		if ( arguments.length ) {
			return new Stream( options );
		}
		return new Stream();
	}
	opts = copy( DEFAULTS );
	if ( arguments.length ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	// The stream's readable state should always be in object mode to prevent newlines from being buffered (concatenated), but without newlines...
	opts.readableObjectMode = true;

	// The stream converts each chunk into a string so no need to decode written strings as Buffer objects:
	opts.decodeStrings = false;

	// Make the stream a Transform stream:
	Transform.call( this, opts );

	// Destroy state:
	this._destroyed = false;

	// Cache the encoding:
	this._encoding = opts.encoding;

	// Line buffer for storing partially complete lines:
	this._buffer = '';

	return this;
} // end FUNCTION Stream()

/**
* Create a prototype which inherits from the parent prototype.
*/
Stream.prototype = Object.create( Transform.prototype );

/**
* Set the constructor.
*/
Stream.prototype.constructor = Stream;

/**
* METHOD: _transform( chunk, encoding, clbk )
*	Implements the `_transform` method.
*
* @private
* @param {Buffer|String} chunk - streamed chunk
* @param {String} encoding - Buffer encoding
* @param {Function} clbk - callback to invoke after transforming the streamed chunk
*/
Stream.prototype._transform = function _transform( chunk, encoding, clbk ) {
	var lines,
		line,
		len,
		i;

	if ( encoding === 'buffer' ) {
		// Default Buffer decoding is 'utf8':
		chunk = chunk.toString();
	}
	else if ( encoding !== 'utf8' ) {
		// Decode the chunk as a 'utf8' string...
		chunk = new Buffer( chunk, encoding );
		chunk = chunk.toString( 'utf8' );
	}
	// Split the chunk into lines:
	lines = chunk.split( RE );

	// How many lines do we have? We do not count the last "line", as it may be incomplete...
	len = lines.length - 1;

	// If we do not have any lines, add the chunk to the buffer and wait for more data...
	if ( len === 0 ) {
		this._buffer += lines[ len ];
	}
	// If we have newline delimited data, concat any previous incomplete line, re-decode (if need be) each line according to its original encoding, push each line to the destination, and set anything leftover as the new line buffer...
	else {
		line = this._buffer + lines[ 0 ];
		line = decode( line, encoding );
		this.push( line, encoding );
		for ( i = 1; i < len; i++ ) {
			line = decode( lines[ i ], encoding );
			this.push( line, encoding );
		}
		this._buffer = lines[ len ];
	}
	clbk();
}; // end METHOD _transform()

/**
* METHOD: _flush( clbk )
*	Implements the `_flush` method.
*
* @private
* @param {Function} clbk - callback to invoke after any final processing
*/
Stream.prototype._flush = function _flush( clbk ) {
	var line = this._buffer;
	if ( line ) {
		line = decode( line, this._encoding );
		this.push( line, this._encoding );
	}
	clbk();
}; // end METHOD _flush()

/**
* METHOD: destroy( [error] )
*	Gracefully destroys a stream, providing backwards compatibility.
*
* @param {Object} [error] - optional error message
* @returns {Stream} Stream instance
*/
Stream.prototype.destroy = function destroy( error ) {
	if ( this._destroyed ) {
		return;
	}
	var self = this;
	this._destroyed = true;
	process.nextTick( close );

	return this;

	/**
	* FUNCTION: close()
	*	Emits a `close` event.
	*
	* @private
	*/
	function close() {
		if ( error ) {
			self.emit( 'error', error );
		}
		self.emit( 'close' );
	}
}; // end METHOD destroy()


// EXPORTS //

module.exports = Stream;
