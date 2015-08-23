'use strict';

var through2 = require( 'through2' ),
	stream = require( './../lib' );

// Create a stream to convert `base64` newline data to UTF-8...
var toString = through2( function onData( chunk, enc, clbk ) {
	chunk = chunk.toString();
	chunk = new Buffer( chunk, 'base64' );
	chunk = chunk.toString();
	this.push( chunk + '\n' );
	clbk();
});

// Create a new stream and pipe to stdout...
var tStream = stream({
	'encoding': 'base64'
});
tStream
	.pipe( toString )
	.pipe( process.stdout );

// Write values to the stream...
var str;
for ( var i = 0; i < 10; i++ ) {
	str = '\n';
	str += i + '\n';
	str += (i*2) + '\n';
	str += '=====' + '\r';
	str = new Buffer( str );
	str = str.toString( 'base64' );
	tStream.write( str, 'base64'  );
}
tStream.end();
