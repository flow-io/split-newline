'use strict';

// MODULES //

var Transform = require( 'readable-stream' ).Transform,
	copy = require( 'utils-copy' ),
	validate = require( './validate.js' );


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
* @param {Boolean} [options.decodeStrings=true] - specifies whether written strings should be decoded into Buffer objects
* @param {Number} [options.highWaterMark=16] - specifies the Buffer level for when `write()` starts returning `false`
* @param {Boolean} [options.allowHalfOpen=false] - specifies whether the stream should remain open even if one side ends
* @param {Boolean} [options.readableObjectMode=false] - specifies whether the readable side should be in object mode
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
	Transform.call( this, opts );
	this._destroyed = false;
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
*/
Stream.prototype._transform = function _transform( chunk, encoding, clbk ) {
	var splits,
		len,
		i;

	chunk = chunk.toString( 'utf8' );
	splits = chunk.split( RE );

	// How many splits do we have? We do not count the last split, as it may be incomplete...
	len = splits.length - 1;

	// If we do not have any splits, add the chunk to the buffer and wait for more data...
	if ( len === 0 ) {
		this._buffer += splits[ len ];
	}
	// If we have newline delimited data, concat any previous incomplete split, push each split to the destination, and add anything leftover to the line buffer...
	else {
		this.push( this._buffer + splits[ 0 ] );
		for ( i = 1; i < len; i++ ) {
			this.push( splits[ i ] );
		}
		this._buffer = splits[ len ];
	}
	clbk();
}; // end METHOD _transform()

/**
* METHOD: _flush( clbk )
*	Implements the `_flush` method.
*
* @private
*/
Stream.prototype._flush = function _flush( clbk ) {
	if ( this._buffer ) {
		this.push( this._buffer );
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
