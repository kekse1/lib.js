# lib.js / Library.js
* https://libjs.de/

The current version is visible in the [version.json](https://raw.githubusercontent.com/kekse1/lib.js/main/version.json).

## Library
Everything (now only NON-browser) in the '**lib.js**/' directory.

### Test cases
See the '**test.js**/' directory, which is kinda 'documentation', where
there's no 'real' documentation available [yet?]. Feel free to comment
on your own - I'd be happy about some help! :)~

#### Globals
I also symlinked the 'lib.js/globals/' directory here in the repositories
root, as they're something special.. and see the 'test.js/globals/', too.

### Installation
There's a script for root and non-root installation (and additionally for
[https://termux.dev/](Termux)), which is just extending the `${PATH}`
environment variable to your `${PREFIX}/usr/bin/`, where the `node.js`
file is linked.

The `node.js` is the file for your script's '[https://en.wikipedia.org/wiki/Shebang_(Unix)](Shebang)'s,
or just to call it with either a script path or by passing your JavaScript code via a regular pipe! ^\_^

