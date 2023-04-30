#!/usr/bin/env node.js

//
var text = TEXT.create('test', 'irc');

//
//text.registerItem('test');
//text.registerItem('irc');

//
const getPhrases = text.getPhrase('hello');

dir(getPhrases, '.getPhrase("hello")');

const withItemIRC = text.getPhrase('hello', 'irc');
const withItemTest = text.getPhrase('hello', 'test');

dir(withItemIRC, '.getPhrase("hello", "irc")');
dir(withItemTest, '.getPhrase("hello", "test")');


//
console.eol(7);
text = TEXT.create();

const result1 = text.getPhrase('test');
const result2 = text.getPhrase('test/hello');
const result3 = text.getPhrase('non-existing');

dir(result1, '.getPhrase("test")');
dir(result2, '.getPhrase("test/hello")');
dir(result3, '.getPhrase("non-existing")');

