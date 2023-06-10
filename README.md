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
See the `test.js/` directory, which is kinda 'documentation'.

There's no 'real' documentation available yet.. and yes, I know that it's totally bad, but I'm spending my time
rather in the code itself but it's documentation. Another reason is that the code could change in this phase,
so I'm rather commenting it l8rs.. eh? ^\_^

### Installation
There's a script for root and non-root installation (and additionally for
[Termux Linux](https://termux.dev/)), which is just extending the `${PATH}`
environment variable to your `${PREFIX}/usr/bin/`, where the `node.js` is linked.

The `node.js` is the file for your script's '[Shebang](https://en.wikipedia.org/wiki/Shebang_(Unix))'s,
or just to call it with either a script path or by passing your JavaScript code via a regular pipe!

The script knows if you already installed it.. and please mention that there'll be no prompt or so,
it'll directly install after running the script.. but there are no real copies or so, it just changes
the `$PATH`, as I already said, **only by creating `/etc/profile.d/(base).sh`** ('base' is the base
directory where you copy this library to; regularily (so in the '.tar' archive @ [libjs.de](https://libjs.de/)
) it's `xyz`).. ;)~

### Favorites
My favorite code in this library are the [`getopt`](lib.js/utility/getopt.js) and the
[`ansi`](lib.js/tty/ansi.js) modules. **INTER ALIA**.. so not to mention the other code here,
which is great as well! ^\_^

JavaScript's based on this library can so **really easy** be extended with colors (and other ANSI
escape sequences), while with `getopt` it's also very easy to use the argument vector.. and also the
[`tty/raw`](lib.js/tty/raw/) module is very useful; for designing, but also for (raw) key and mouse
handling in the console.. etc.

**TODO**: also this `README.md` will be extended l8rs..

### Globals
They're something 'special' in the way that they're extending the most global objects, etc.
Here's a quick overview over them:

* [Arguments](lib.js/globals/arguments.js)
* [Array](lib.js/globals/array.js)
* [BigInt](lib.js/globals/bigint.js)
* [Boolean](lib.js/globals/boolean.js)
* [DataView](lib.js/globals/dataview.js)
* [Date](lib.js/globals/date.js)
* [Error](lib.js/globals/error.js)
* [Function](lib.js/globals/function.js)
* [Map](lib.js/globals/map.js)
* [Math](lib.js/globals/math.js)
* [Number](lib.js/globals/number.js)
* [Object](lib.js/globals/object.js)
* [Proxy](lib.js/globals/proxy.js)
* [Reflect](lib.js/globals/reflect.js)
* [RegExp](lib.js/globals/regexp.js)
* [Set](lib.js/globals/set.js)
* [String](lib.js/globals/string.js)
* [TypedArray](lib.js/globals/typedarray.js)
* [UInt8Array](lib.js/globals/uint8array.js)

## Copyright and License
The Copyright is [(c) Sebastian Kucharczyk](./COPYRIGHT.txt),
and it's licensed under the [MIT](./LICENSE.txt) (also known as 'X' or 'X11' license).

