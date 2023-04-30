(function()
{

	//
	const DEFAULT_KNUTH_GCD = true;

	//
	BigNum = module.exports = class BigNum extends NODE
	{
		constructor(... _args)
		{
			const options = Object.assign(... _args);

			if(typeof _args[0] === 'bigint')
			{
				options.numerator = _args[0];
			}

			if(typeof _args[1] === 'bigint')
			{
				options.denominator = _args[1];
			}

			super(Object.assign(options, ... _args));
		}

		static create(_numerator, _denominator, ... _args)
		{
			const options = Object.assign(... _args);

			options.numerator = _numerator;
			options.denominator = _denominator;

			return new this(options);
		}

		get numerator()
		{
			if(typeof this.options.numerator === 'bigint')
			{
				return this.options.numerator;
			}

			return 0n;
		}

		set numerator(_value)
		{
			if(typeof _value === 'bigint')
			{
				return this.options.numerator = _value;
			}

			return this.numerator;
		}

		get denominator()
		{
			if(typeof this.options.denominator === 'bigint')
			{
				return this.options.denominator;
			}

			return 0n;
		}

		set denominator(_value)
		{
			if(typeof _value === 'bigint')
			{
				return this.options.denominator = _value;
			}

			return this.denominator;
		}

		/*
		 * Um die arithmetischen Operationen transparent durchzuführen, könntest du zusätzlich Methoden implementieren, die das Ergebnis der Operation in der kleinsten gemeinsamen Vielfachen (kgV) der beiden Nenner darstellen. Hier ist ein Beispiel für die Additionsmethode mit dieser Anpassung:
		 */
		add(_other)
		{
			//const numerator = this.numerator * _other.denominator + _other.numerator * this.denominator;
			//const denominator = this.denominator * _other.denominator;
			const lcm = Math.lcm(this.denominator, _other.denominator);
			const numerator = (lcm / this.denominator) * this.numerator + (lcm / _other.denominator) * _other.numerator;
			return new BigNum(numerator, lcm);
		}

		/*
		 * Ja, in JavaScript ist es möglich, Operatoren zu überladen, indem man spezielle Methoden in der Klasse definiert, die für den jeweiligen Operator verwendet werden.
		 * >> let c = a + b; // Gleich wie BigNum.add(a, b)
		 */
		/*static add(_a, _b)
		{
			return _a.add(_b);
		}*/
		/*
		 * Es ist auch möglich, andere Operatoren wie -, *, / und % zu überladen, indem man entsprechende Methoden in der Klasse definiert. Hier ist eine Liste von Methoden, die man für die Überladung von Operatoren in JavaScript verwenden kann:
		 *
		 * valueOf: Wird verwendet, um den Wert eines Objekts in einem Kontext zurückzugeben, in dem ein primitive Datentyp erwartet wird.
		 * toString: Wird verwendet, um den String-Wert eines Objekts zurückzugeben.
		 * [Symbol.toPrimitive]: Wird verwendet, um den Wert eines Objekts in einem Kontext zurückzugeben, in dem ein primitive Datentyp erwartet wird.
		 * [Symbol.for('+')]: Wird verwendet, um die +-Operatorüberladung zu implementieren.
		 * [Symbol.for('-')]: Wird verwendet, um die --Operatorüberladung zu implementieren.
		 * [Symbol.for('*')]: Wird verwendet, um die *-Operatorüberladung zu implementieren.
		 * [Symbol.for('/')]: Wird verwendet, um die /-Operatorüberladung zu implementieren.
		 * [Symbol.for('%')]: Wird verwendet, um die %-Operatorüberladung zu implementieren.
		 * Ich hoffe, das hilft! Lass mich wissen, wenn du noch weitere Fragen hast.
		 *
		 * Es gibt ein paar Unterschiede zwischen [Symbol.for('+')] und static add().
		 *
		 * Ein Vorteil von [Symbol.for('+')] ist, dass es eine Möglichkeit bietet, den +-Operator für bestimmte Objekte zu überladen, ohne dass man eine neue Methode in der Klasse definieren muss. Dies kann nützlich sein, wenn man bestimmte Funktionalitäten für einzelne Instanzen einer Klasse anbieten möchte, ohne die Methode für alle Instanzen verfügbar zu machen.
		 *
		 * Ein Nachteil von [Symbol.for('+')] ist jedoch, dass es nicht so leicht lesbar ist wie static add(). Es ist weniger offensichtlich, was die Methode tut, und es könnte für Entwickler schwieriger sein, sich an die Verwendung dieser Methode zu erinnern.
		 *
		 * In Bezug auf die Leistung gibt es keinen signifikanten Unterschied zwischen den beiden Methoden. Beide bieten eine Möglichkeit, den +-Operator zu überladen und können in etwa die gleiche Leistung bieten.
		 *
		 * Es ist also wichtig, beide Methoden zu verstehen und abzuwägen, welche am besten für das jeweilige Projekt geeignet ist. In manchen Fällen könnte es besser sein, static add() zu verwenden, während in anderen Fällen [Symbol.for('+')] die bessere Wahl sein könnte.
		 */

		/*
		 * Ja, in den oben gezeigten Methoden werden die lcm- und gcd-Methoden verwendet, um das Ergebnis der Operation in der kleinsten gemeinsamen Vielfachen (kgV) der Nenner darzustellen. Dies wird in den Methoden add und subtract verwendet, um sicherzustellen, dass die Nenner beider BigNums gleich sind, bevor die Operation durchgeführt wird. In den Methoden multiply und divide wird das kgV nicht benötigt, da in diesen Operationen die Nenner miteinander multipliziert bzw. dividiert werden. Die mod-Methode verwendet auch kein kgV, da sie lediglich den Rest der Division zurückgibt.
		 */
		sub(_other)
		{
			const lcm = Math.lcm(this.denominator, _other.denominator);
			const numerator = (lcm / this.denominator) * this.numerator - (lcm / _other.denominator) * _other.numerator;
			return new BigNum(numerator, lcm);
		}

		mul(_other)
		{
			const numerator = this.numerator * _other.numerator;
			const denominator = this.denominator * _other.denominator;
			return new BigNum(numerator, denominator);
		}

		div(_other)
		{
			const numerator = this.numerator * _other.denominator;
			const denominator = this.denominator * _other.numerator;
			return new BigNum(numerator, denominator);
		}

		mod(_other)
		{
			const remainder = this.numerator % (_other.numerator * this.denominator);
			return new BigNum(remainder, this.denominator);
		}

		static equal(... _a)
		{
	throw new Error('TODO');
		}

		//TODO/lcm, gcd????
		equal(_other)
		{
			return (this.numerator === _other.numerator && this.denominator === _other.denominator);
		}

		eq(_other)
		{
			return this.equal(_other);
		}

		ne(_other)
		{
			return !this.equal(_other);
		}

		lt(_other)
		{
		}

		gt(_other)
		{
		}

		le(_other)
		{
		}
		
		ge(_other)
		{
		}

		// bignum's kuerzen, um sicher zu stellen, dass der nenner keine gemeinsamen faktoren mit dem zaehler hat
		/*
		 * Um sicherzustellen, dass der Nenner keine gemeinsamen Faktoren mit dem Zähler hat, kann man die gcd-Methode verwenden, um den größten gemeinsamen Faktor von Zähler und Nenner zu berechnen, und dann den Zähler und den Nenner durch den gcd teilen. Hier ist eine Funktion, die dies macht:
		 */
		reduce(_numerator, _denominator)
		{
			const gcd = BigNum.gcd(_numerator, _denominator);
			return [ _numerator / gcd, _denominator / gcd ];
		}
		
		static gcd(_a, _b, _knuth = DEFAULT_KNUTH_GCD)
		{
			if(typeof _knuth !== 'boolean')
			{
				_knuth = DEFAULT_KNUTH_GCD;
			}
			
			if(_knuth)
			{
				return Math.gcd.binary(_a, _b);
			}
			
			return Math.gcd.euclidean(_a, _b);
		}

		// verschiedene radix-konversionen @ .toString() sowie (static).parse()!!!
		// konversion in andere wie Number sowie BigInt?!? wenigstens einen teil.. ^_^
		// dynamische vs feste groeszen/limits/... @ speicher manangement
		// //TODO/...
		//
		// < https://github.com/MikeMcl/decimal.js >
		// < http://mikemcl.github.io/decimal.js/ >
		// ..
		//

	}

	//
	
})();

