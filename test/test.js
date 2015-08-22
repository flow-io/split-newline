/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	Stream = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'flow-split-newline', function tests() {

	it( 'should export a function', function test() {
		expect( Stream ).to.be.a( 'function' );
	});

});
