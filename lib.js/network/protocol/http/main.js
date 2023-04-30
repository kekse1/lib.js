(function()
{

	//
	http = module.exports = {
		version: [ 1, 1 ]
	};

	//
	http.method = require('network/protocol/http/method.json');
	http.status = require('network/protocol/http/status.json');
	http.limit = require('network/protocol/http/limit.json');

	//
	http.header = require('network/protocol/http/header');

	//
	http.rfc822 = require('network/protocol/http/rfc822');

	//
	http.request = require('network/protocol/http/request');
	http.response = require('network/protocol/http/response');

	//
	http.router = require('network/protocol/http/router/');
	
	//
	//http.tunnel = ...?! extends net/..
	//http.filter = ...!! extends net/...

	//
	http.upgrade = require('network/protocol/http/upgrade/');

	//
	//http.server?
	//http.client??

	//

})();

