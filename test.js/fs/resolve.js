#!/usr/bin/env node.js

//
// special extension of 'path.resolve()', where any symbolic link in the path
// will be replaced by the resource path it's pointing to... THE WHOLE PATH,
// not only the last part.. ;-)
//
// thought it would be integrated in 'path.resolve()', but it ain't, as it seems..
//

dir(fs.resolve('./symlinks/symlinks/', true), 'fs.resolve(..., true)');
dir(fs.resolve('./symlinks/symlinks/symlinks/symlinks'), 'fs.resolve()');
dir(fs.resolve('./symlinks/symlinks/symlinks/symlinks/test.ln'), 'fs.resolve() w/ file');
dir(path.resolve('./symlinks/symlinks/symlinks/symlinks/test.ln'), 'path.resolve()');
dir(fs.resolve('./symlinks/symlinks/abc', false), 'fs.resolve(..., false)');
dir(fs.resolve('./symlinks/symlinks/abc', true), 'fs.resolve(..., true)');

