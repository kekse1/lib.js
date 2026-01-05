/*
* Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
* https://kekse.biz/ https://github.com/kekse1/v4/
*/

//
// "Bloom Filter(s)".
//
// ... look @ < https://samwho.dev/bloom-filters/ >
//

//
const bloom = global.bloom = {};
export default bloom;

//
// optimum amount of bits for expected items
// and a false-positive rate (1% == 0.01);
//
bloom.bits = (_items, _fpr) => {
	const n = (-_items * Math.log(_fpr));
	const d = (Math.log(2) ** 2);
	return Math._ceil(n / d);
};

//
// optimum number of hash algorithms..
bloom.hashes = (_items, _bits) => {
	return Math._ceil(
		(_bits / _items) *
			Math.log(2));
};

//

