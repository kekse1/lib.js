(function()
{

	//
	const DEFAULT_SYNC = (1000 * 60 * 3); //sync every 3 minutes

	//
	clock = module.exports = EVENT.create();

	//
	//TODO/ das ist, um erst bei on('second') bspw. den sekunden-takt anzuschalten, bzw. aus bei off(), falls nichts mehr uebrig...
	//
	var specialListeners = Object.create(null);

	clock.addSpecialEvent('second');
	clock.addSpecialEvent('frame');

	clock.on('newSpecialListener', (_name) => {
		if(! (_name in specialListeners))
		{
			specialListeners[_name] = 0;
		}

		return ++specialListeners[_name];
	});

	clock.on('removeSpecialListener', (_name) => {
		if(_name in specialListeners)
		{
			if(--specialListeners[_name] <= 0)
			{
				delete specialListeners[_name];
				return 0;
			}

			return specialListeners[_name];
		}

		return 0;
	});

	clock.on('resetEvents', () => {
		specialListeners = Object.create(null);
	});

	//das auch!???
	/*clock.on('clearEvents', () => {
		specialListeners = Object.create(null);
	});*/

	//
	clock.sync = function()
	{
	}

	//
	//TODO/das hier ist fuer animationen bspw..
	//.. siehe 'libjs.de/js/clock.js'!!
	//
	clock.start = function(... _args)
	{
	}

	clock.stop = function(... _args)
	{
	}

	clock.pause = function(... _args)
	{
	}
	
	clock.resume = function(... _args)
	{
	}

	//

})();

