'use strict';

var stream = require( './../lib' );

// Create a new stream and pipe to stdout...
var tStream = stream();
tStream.pipe( process.stdout );

// Write values to the stream...
tStream.write( '|' );
for ( var i = 0; i < 1000; i++ ) {
	tStream.write( i+'|\n'+(i*2)+'|\n'  );
}
tStream.end();
