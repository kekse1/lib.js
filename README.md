<img src="https://kekse.biz/php/count.php?draw&override=github:lib.js&fg=120,130,40&size=48&v=16" />

# lib.js / Library.js
The official website is [libjs.de](https://libjs.de/).
The current version is visible in the [`version.json`](version.json).

## Library
Everything (now only NON-browser) in the `lib.js/` directory.

The rest, the browser part, is now available at [github/kekse1/kekse.biz/](https://github.com/kekse1/kekse.biz/),
which grew there as I worked on my private website [kekse.biz](https://kekse.biz/). It replaces the old 'browser/'
part of this library.

### Test cases
See the `test.js/` directory, which is kinda 'documentation'. There's no 'real'
documentation available [yet?].

#### Globals
I also symlinked the `lib.js/globals/` directory here in the repositories root,
as they're something special.. and see the `test.js/globals/` directory, too.

### Installation
There's a script for root and non-root installation (and additionally for
[Termux Linux](https://termux.dev/)), which is just extending the `${PATH}`
environment variable to your `${PREFIX}/usr/bin/`, where the `node.js` is linked.

The `node.js` is the file for your script's '[Shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)]'s,
or just to call it with either a script path or by passing your JavaScript code via a regular pipe!

