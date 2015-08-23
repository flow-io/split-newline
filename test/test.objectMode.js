/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	Stream = require( './../lib/stream.js' ),
	objectMode = require( './../lib/objectMode.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'object mode', function tests() {

	it( 'should export a function', function test() {
		expect( objectMode ).to.be.a( 'function' );
	});

	it( 'should return a stream', function test() {
		var tStream = objectMode();
		assert.isTrue( tStream instanceof Stream );
	});

	it( 'should return a stream which allows writing objects', function test() {
		var tStream = objectMode({
			// this should be overridden...
			'objectMode': false
		});

		tStream.write( new String( 'beep' ) );
		tStream.end();
		assert.ok( true );
	});

});
