<img src="https://kekse.biz/php/count.php?draw&override=github:lib.js&fg=120,130,40&size=48&v=16" />

# lib.js / Library.js
The official website is [libjs.de](https://libjs.de/).
The current version is visible in the [`version.json`](version.json).

## Library
Everything (now only NON-browser) in the `lib.js/` directory.

The rest, the browser part, is now available at [github/kekse1/kekse.biz/](https://github.com/kekse1/kekse.biz/),
which grew there as I worked on my private website [kekse.biz](https://kekse.biz/). It replaces the old 'browser/'
part of this library.

_Hint_: if you don't want to use this library, see it at least as a provider for some useful code. It collects
some nice mathematical functions, e.g.. etc.

### Test cases
See the `test.js/` directory, which is kinda 'documentation'. There's no 'real'
documentation available [yet?].

### Installation
There's a script for root and non-root installation (and additionally for
[Termux Linux](https://termux.dev/)), which is just extending the `${PATH}`
environment variable to your `${PREFIX}/usr/bin/`, where the `node.js` is linked.

The `node.js` is the file for your script's '[Shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)]'s,
or just to call it with either a script path or by passing your JavaScript code via a regular pipe!

### Globals
I also symlinked the `lib.js/globals/` directory here in the repositories root,
as they're something special. And also take a look at the `test.js/globals/`
directory, where those globals are tested very well.

* [Arguments](globals/arguments.js)
* [Array](globals/array.js)
* [BigInt](globals/bigint.js)
* [Boolean](globals/boolean.js)
* [DataView](globals/dataview.js)
* [Date](globals/date.js)
* [Error](globals/error.js)
* [Function](globals/function.js)
* [Map](globals/map.js)
* [Math](globals/math.js)
* [Number](globals/number.js)
* [Object](globals/object.js)
* [Proxy](globals/proxy.js)
* [Reflect](globals/reflect.js)
* [RegExp](globals/regexp.js)
* [Set](globals/set.js)
* [String](globals/string.js)
* [TypedArray](globals/typedarray.js)
* [UInt8Array](globals/uint8array.js)

## Copyright and License
The Copyright is [(c) Sebastian Kucharczyk](./COPYRIGHT.txt),
and it's licensed under the [MIT](./LICENSE.txt) (also known as 'X' or 'X11' license).

