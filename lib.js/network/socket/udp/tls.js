const tls = require('tls');

//TODO/ USE *SNI*?????
const options = {
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.crt')
};

const pair = tls.createSecurePair(
	options, false, true, false);

const cleartext = pair.cleartext;
const encrypted = pair.encrypted;

cleartext.on('data', (_data) => {
	console.log(`Received: %s (as: %s)`, _data.toString(), _data.constructor.name);
});

encrypted.write('something');

