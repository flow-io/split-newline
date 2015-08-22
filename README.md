Split Newline
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Creates a [transform stream](https://nodejs.org/api/stream.html) which splits newline delimited data.


## Installation

``` bash
$ npm install flow-split-newline
```


## Usage

``` javascript
var stream = require( 'flow-split-newline' );
```

#### stream( [options] )

Creates a [transform stream](https://nodejs.org/api/stream.html) which splits newline delimited data.

``` javascript
var tStream = stream();

tStream.pipe( process.stdout );
tStream.write( '1\n2\n3' );
// => 1 => 2 => 3

tStream.end();
```

The function accepts the following `options`:

*	__objectMode__: `boolean` which specifies whether a [stream](https://nodejs.org/api/stream.html) should operate in object mode. Default: `false`.
* 	__encoding__: specifies how `Buffer` objects should be decoded to `strings`. Default: `null`.
*	__decodeStrings__: `boolean` which specifies whether written `strings` should be decoded into `Buffer` objects. Default: `true`.
*	__highWaterMark__: specifies the `Buffer` level at which `write()` calls start returning `false`. Default: `16` (16kb).
*	__allowHalfOpen__: specifies whether the stream should remain open even if one side ends. Default: `false`.
*	__readableObjectMode__: specifies whether the readable side should be in object mode. Default: `false`.
*	__writableObjectMode__: specifies whether the writable side should be in object mode. Default: `false`.

To set [stream](https://nodejs.org/api/stream.html) `options`,

``` javascript
var opts = {
	'objectMode': true,
	'encoding': 'utf8',
	'decodeStrings': false,
	'highWaterMark': 64,
	'allowHalfOpen': true,
	'readableObjectMode': true,
	'writableObjectMode': false // overridden by `objectMode` option as `objectMode=true`
};

var tStream = stream( opts );
```

#### stream.factory( options )

Returns a reusable [stream](https://nodejs.org/api/stream.html) factory. The factory method ensures [streams](https://nodejs.org/api/stream.html) are configured identically by using the same set of provided `options`.

``` javascript
var opts = {
	'objectMode': true,
	'encoding': 'utf8',
	'decodeStrings': false,
	'highWaterMark': 64	
};

var factory = stream.factory( opts );

// Create 10 identically configured streams...
var streams = [];
for ( var i = 0; i < 10; i++ ) {
	streams.push( factory() );
}
```


#### stream.objectMode( [options] )

This method is a convenience function to create [streams](https://nodejs.org/api/stream.html) which always operate in `objectMode`. The method will __always__ override the `objectMode` option in `options`.

``` javascript
var tStream = stream.objectMode();

tStream.pipe( process.stdout );
tStream.write( 'a\nb\nc' );
// => a => b => c

tStream.end();
```


## Examples

``` javascript
var stream = require( 'flow-split-newline' );

// Create a new stream and pipe to stdout...
var tStream = stream();
tStream.pipe( process.stdout );

// Write values to the stream...
tStream.write( '|' );
for ( var i = 0; i < 1000; i++ ) {
	tStream.write( i+'|\n'+(i*2)+'|\n'  );
}
tStream.end();
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```

---
## CLI


### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g flow-split-newline
```


### Usage

``` bash
Usage: flow-split-newline [options]

Options:

  -h,   --help                 Print this message.
  -V,   --version              Print the package version.
  -hwm, --highwatermark [hwm]  Specify how much data can be buffered into memory
                               before applying back pressure. Default: 16KB.
  -enc, --encoding [encoding]  String encoding.
  -nds, --no-decodestrings     Prevent strings from being converted into buffers before
                               streaming to destination. Default: false.
  -aho, --allowhalfopen        Keep the stream open if either the readable or writable
                               side ends. Default: false.
  -om,  --objectmode           Write any value rather than only buffers and strings.
                               Default: false.
  -rom, --readableobjectmode   Read values as objects rather than buffers. Default: false.
  -wom, --writableobjectmode   Write values as objects rather than buffers. Default: false.
```

The `flow-split-newline` command is available as a [standard stream](http://en.wikipedia.org/wiki/Pipeline_%28Unix%29).

``` bash
$ <stdout> | flow-split-newline | <stdin>
``` 


### Examples

``` bash
$ echo $'1\n2\n3' | flow-split-newline
```

For local installations, modify the above command to point to the local installation directory; e.g., 

``` bash
$ echo $'a\nb\nc' | ./node_modules/.bin/flow-split-newline
```

Or, if you have cloned this repository and run `npm install`, modify the command to point to the executable; e.g., 

``` bash
$ echo $'beep\nboop\nbop' | node ./bin/cli
```

---
## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. The [Flow.io](http://flow-io.com) Authors.


[npm-image]: http://img.shields.io/npm/v/flow-split-newline.svg
[npm-url]: https://npmjs.org/package/flow-split-newline

[travis-image]: http://img.shields.io/travis/flow-io/split-newline/master.svg
[travis-url]: https://travis-ci.org/flow-io/split-newline

[codecov-image]: https://img.shields.io/codecov/c/github/flow-io/split-newline/master.svg
[codecov-url]: https://codecov.io/github/flow-io/split-newline?branch=master

[dependencies-image]: http://img.shields.io/david/flow-io/split-newline.svg
[dependencies-url]: https://david-dm.org/flow-io/split-newline

[dev-dependencies-image]: http://img.shields.io/david/dev/flow-io/split-newline.svg
[dev-dependencies-url]: https://david-dm.org/dev/flow-io/split-newline

[github-issues-image]: http://img.shields.io/github/issues/flow-io/split-newline.svg
[github-issues-url]: https://github.com/flow-io/split-newline/issues
