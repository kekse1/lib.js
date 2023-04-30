(function()
{

	//
	CONFIG.HIDDEN_MEMBERS = true;//only for the 'core/' part... hidden members are prefixed by '_'.
	//
	CONFIG.EXIT = 255;//if not an integer, no return on exceptions...
	CONFIG.OFF = false; //use JSOFF (de-)serialization 'utility/jsoff' instead of regular JSON... ^_^
	CONFIG.CIRCULAR = 8;
	CONFIG.FRAGMENTATION = 16384;
	CONFIG.TRACE = 32;//'Error.stackTraceLimit' (see also 'global.js'(DEFAULT_TRACE))
	CONFIG.LATEST = false;//see './latest/'.......
	//CONFIG.HOME = '.lib.js/';
	CONFIG.HOME = '.lib.js';
	CONFIG.ROOT = '~/.xyz/';
	CONFIG.LANGUAGE = 'en';//'de';
	CONFIG.FALLBACK = ['en','de'];
	//
	CONFIG.CHUNK = 4096;
	//
	CONFIG.SORT = 'radix';//see 'ext/sort.js'..
	CONFIG.CRYPTO = true;
	CONFIG.PREFERENCE = true;//prefer [ ".", "-", "+" ] over pure byte code in numerical conversions..
	//
	CONFIG.RADIX_RANDOM = true;//see '[global.]radix()' etc..
	CONFIG.RADIX_RANGE = [ 16, 0 ];
	CONFIG.RADIX_INTERVAL = true;//4826;
	//
	CONFIG.SPEED = 1.0;
	CONFIG.CONVERT = '';//'ms';'sin';'psin';
	//
	CONFIG.FONTS = [ 'Candara', 'Quicksand', 'Open Sans', 'Calibri', 'Source Code Pro' ];//see ./css/.. these are my favorites.
	CONFIG.TARGET = 'TARGET';//'BODY';
	//
	CONFIG.ERRORS = 'BSOD';//'TEXT';
	CONFIG.ERRORS_BSOD = '';
	CONFIG.ERRORS_TEXT = 'textarea';//'div';
	CONFIG.LOAD = [ '.html', '.css', '.js' ];
	CONFIG.LOCALIZE = [ '.html', '.htm', '.txt', '.json' ];
	//
	CONFIG.MOVING = true;
	CONFIG.CMS = true;
	CONFIG.CGI = 'cgi';
	//
	CONFIG.THRESHOLD_MS = 500;
	CONFIG.THRESHOLD_PX = 25;
	//
	CONFIG.KEYS = 8;
	//
	//CONFIG.HELP_DELAY = 1000;//after which time popup will show up
	//
	CONFIG.BIONIC = true;
	CONFIG.BIONIC_FIXATION = null;
	CONFIG.BIONIC_SAKKADE_WORDS = null;
	CONFIG.BIONIC_SAKKADE_CHARS = null;
	//
	CONFIG.CHARSET = 'UTF-8';
	CONFIG.SCALE = 1.25;
	CONFIG.ZOOM = true;//false;//test TRUE, too!! auch 'event.preventDefault()' on 'body.onwheel'..//!??
	CONFIG.OVERSCROLL = false;//...
	//
	CONFIG.HOSTNAME = 'kekse.biz';
	CONFIG.FAVICON = '/favicon.png';
	CONFIG.CODE = 0;
	CONFIG.ENCODE = true;
	//
	CONFIG.DIR_COMPACT = true;
	CONFIG.DIR_DEPTH = 8;
	CONFIG.DIR_COLORS = true;
	CONFIG.DIR_GETTERS = true;
	CONFIG.DIR_HIDDEN = true;
	//
	CONFIG.DEPTH_CLONE = 8;	//Object.[..]clone()
	//
	CONFIG.SIGNALS = true;//should really stay (true); see 'node/process.js'... [e.g. RAW-cleanup(), etc..]; ...
	CONFIG.SIGNAL = false;//many times these both are annoying -- e.g. if you redirect some output to a file, or so...
	CONFIG.UPTIME = false;//but as it's usual here, you can just set `signal=yes uptime=yes ./node.js` @ process call! ;-)
	CONFIG.SIGNAL_EXIT = true;//should stay true...
	//TODO/w/ String.parse();..!!! (see also 'encoding/ENCODING', atm only if("null/false/true/..")...
	//TODO/...!!!!
	CONFIG.STDIO_ERROR_THROW = false;//show the _error on stdio[i].onerror()!???
	CONFIG.STDIO_ERROR_THROW_FILE = false;//throw file output errors..
	CONFIG.STDIO_ERROR_THROW_LOG = null;//'stdio-error.log';//needs to be a string.. file name. w/o dir it'll be in cwd.
	CONFIG.STDIO_ERROR_THROW_EXIT = 255;//true will end with random return code.. int's clear.. anything else disabled proces.exit()
	//
	CONFIG.MODE_FILE = 0o600;
	CONFIG.MODE_DIRECTORY = 0o700;
	//
	CONFIG.TEE = false;
	CONFIG.WRITE = true;
	CONFIG.LOG = true;
	CONFIG.INFO = true;
	CONFIG.WARN = true;
	CONFIG.ERROR = true;
	CONFIG.DEBUG = true;
	CONFIG.HIGH = true;
	CONFIG.STDOUT = true;
	CONFIG.STDERR = true;
	//
	CONFIG.INJECT = false;//(false) is better for daily use...! otherwise bad "side-effects" or so...
	CONFIG.ANSI = true;
	CONFIG.FORCE = false;
	CONFIG.RESPECT = true;
	CONFIG.ENCODING = 'utf8';
	CONFIG.DATE = 'best';//'%y-%m-%d (%H:%M:%S.%s)';
	CONFIG.BASE = 1024;
	CONFIG.TABS = 4;
	CONFIG.LINE = ",.-'`'-.,";//'/';//'=';
	CONFIG.PREFIX_LOG = ' >> ';
	CONFIG.PREFIX_INFO = ' >> ';
	CONFIG.PREFIX_WARN = ' >> ';
	CONFIG.PREFIX_ERROR = ' >> ';
	CONFIG.PREFIX_DEBUG = ' >> ';
	CONFIG.PREFIX_HIGH = ' >> ';
	CONFIG.FORCE_RB = true;
	CONFIG.FORCE_CZ = true;
	CONFIG.RB = false;
	CONFIG.CZ = false;
	CONFIG.CZ_G = [ 255, 136 ];
	CONFIG.CZ_LOG = true;
	CONFIG.COLOR_STDOUT = false;
	CONFIG.COLOR_STDERR = 'error';
	CONFIG.COLOR_HIGH = '#ffeb0a';
	CONFIG.COLOR_HIGH_C = '#000';
	CONFIG.COLOR_LOG = false;
	CONFIG.COLOR_LOG_C = false;		//contrast (e.g. (false), too!)
	CONFIG.COLOR_LOG_C_HTML = false;//'#fff';	//html contrast ((false) to deactivate!)
	CONFIG.COLOR_INFO = '#adea44';
	CONFIG.COLOR_INFO_C = '#000';
	CONFIG.COLOR_INFO_C_HTML = false;//'#fff';
	CONFIG.COLOR_WARN = '#ff9914';
	CONFIG.COLOR_WARN_C = '#000';
	CONFIG.COLOR_WARN_C_HTML = false;//'#fff';
	CONFIG.COLOR_ERROR = '#f24333';
	CONFIG.COLOR_ERROR_C = '#000';
	CONFIG.COLOR_ERROR_C_HTML = false;//'#fff';
	CONFIG.COLOR_DEBUG = '#44acea';
	CONFIG.COLOR_DEBUG_C = '#000';
	CONFIG.COLOR_DEBUG_C_HTML = false;//'#fff';
	CONFIG.REDUCE = '';//'math'||'modulo'||'...';
	//
	CONFIG.CONSOLE = true;//TODO/..
	//
	CONFIG.FULL = 16;
	CONFIG.HALF = 32;
	//

})();

//
module.exports = CONFIG;
