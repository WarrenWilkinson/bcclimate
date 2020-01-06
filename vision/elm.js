(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.cY.bj === region.bE.bj)
	{
		return 'on line ' + region.cY.bj;
	}
	return 'on lines ' + region.cY.bj + ' through ' + region.bE.bj;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.eK,
		impl.fi,
		impl.e8,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		as: func(record.as),
		cZ: record.cZ,
		cK: record.cK
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.as;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.cZ;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.cK) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.eK,
		impl.fi,
		impl.e8,
		function(sendToApp, initialModel) {
			var view = impl.fj;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.eK,
		impl.fi,
		impl.e8,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.cR && impl.cR(sendToApp)
			var view = impl.fj;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.em);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.fb) && (_VirtualDom_doc.title = title = doc.fb);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.eW;
	var onUrlRequest = impl.eX;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		cR: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.dV === next.dV
							&& curr.dt === next.dt
							&& curr.dR.a === next.dR.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		eK: function(flags)
		{
			return A3(impl.eK, flags, _Browser_getUrl(), key);
		},
		fj: impl.fj,
		fi: impl.fi,
		e8: impl.e8
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { eF: 'hidden', eq: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { eF: 'mozHidden', eq: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { eF: 'msHidden', eq: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { eF: 'webkitHidden', eq: 'webkitvisibilitychange' }
		: { eF: 'hidden', eq: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		d1: _Browser_getScene(),
		ed: {
			fm: _Browser_window.pageXOffset,
			fp: _Browser_window.pageYOffset,
			eg: _Browser_doc.documentElement.clientWidth,
			ds: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		eg: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		ds: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			d1: {
				eg: node.scrollWidth,
				ds: node.scrollHeight
			},
			ed: {
				fm: node.scrollLeft,
				fp: node.scrollTop,
				eg: node.clientWidth,
				ds: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			d1: _Browser_getScene(),
			ed: {
				fm: x,
				fp: y,
				eg: _Browser_doc.documentElement.clientWidth,
				ds: _Browser_doc.documentElement.clientHeight
			},
			dl: {
				fm: x + rect.left,
				fp: y + rect.top,
				eg: rect.width,
				ds: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.j) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.o),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.o);
		} else {
			var treeLen = builder.j * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.p) : builder.p;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.j);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.o) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.o);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{p: nodeList, j: (len / $elm$core$Array$branchFactor) | 0, o: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {dr: fragment, dt: host, dP: path, dR: port_, dV: protocol, dW: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Main$Item = function (a) {
	return {$: 0, a: a};
};
var $author$project$CModel$coquitlam = {t: 14.90, u: 11.95, v: 3.80, w: 8.4, x: 1.16, S: 41950, T: 165470, U: 10325, k: 41950, l: 165470, n: 10325, V: 0.00, W: 0.08};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $author$project$Main$initialAnimations = $elm$core$Dict$empty;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$Group = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Main$regionTree = A2(
	$author$project$Main$Group,
	'Regions',
	_List_fromArray(
		[
			A2(
			$author$project$Main$Group,
			'British Columbia',
			_List_fromArray(
				[
					A2(
					$author$project$Main$Group,
					'Greater Vancouver',
					_List_fromArray(
						[
							A2(
							$author$project$Main$Group,
							'Tri-Cities',
							_List_fromArray(
								[
									$author$project$Main$Item('Coquitlam'),
									$author$project$Main$Item('Port Coquitlam'),
									$author$project$Main$Item('Port Moody')
								]))
						]))
				]))
		]));
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		{
			i: $author$project$Main$initialAnimations,
			a4: $author$project$CModel$coquitlam,
			aA: _List_fromArray(
				[$author$project$Main$regionTree]),
			ab: $author$project$CModel$coquitlam,
			aC: $elm$core$Maybe$Nothing,
			bg: 1977366,
			bh: 0,
			aG: _List_fromArray(
				[
					$author$project$Main$Item('Coquitlam'),
					$author$project$Main$Item('Port Coquitlam'),
					$author$project$Main$Item('Port Moody')
				])
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Main$MouseMove = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Main$MouseUp = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$Main$ScreenResolution = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Main$TimeDelta = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Basics$not = _Basics_not;
var $author$project$Main$anyPlayingAnimation = function (a) {
	return !$elm$core$Dict$isEmpty(a);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Preliminary$decodeX = A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float);
var $author$project$Preliminary$decodeY = A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float);
var $author$project$Preliminary$mouseCoords = function (msg) {
	return A3($elm$json$Json$Decode$map2, msg, $author$project$Preliminary$decodeX, $author$project$Preliminary$decodeY);
};
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {cx: oldTime, dY: request, d7: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$browser$Browser$AnimationManager$now = _Browser_now(0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(0);
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.dY;
		var oldTime = _v0.cx;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 1) {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.d7;
		var oldTime = _v0.cx;
		var send = function (sub) {
			if (!sub.$) {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (!sub.$) {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrameDelta = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Delta(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrameDelta = $elm$browser$Browser$AnimationManager$onAnimationFrameDelta;
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {dQ: pids, d7: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {dn: event, dB: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.dQ,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.dB;
		var event = _v0.dn;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.d7);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onMouseMove = A2($elm$browser$Browser$Events$on, 0, 'mousemove');
var $elm$browser$Browser$Events$onMouseUp = A2($elm$browser$Browser$Events$on, 0, 'mouseup');
var $elm$browser$Browser$Events$Window = 1;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		1,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $author$project$Main$subscriptions = function (model) {
	var s1 = function () {
		var _v1 = model.aC;
		if (_v1.$ === 1) {
			return _List_Nil;
		} else {
			return _List_fromArray(
				[
					$elm$browser$Browser$Events$onMouseMove(
					$author$project$Preliminary$mouseCoords($author$project$Main$MouseMove)),
					$elm$browser$Browser$Events$onMouseUp(
					$author$project$Preliminary$mouseCoords($author$project$Main$MouseUp))
				]);
		}
	}();
	var s2 = function () {
		var _v0 = $author$project$Main$anyPlayingAnimation(model.i);
		if (_v0) {
			return A2(
				$elm$core$List$cons,
				$elm$browser$Browser$Events$onAnimationFrameDelta(
					function (f) {
						return $author$project$Main$TimeDelta(f);
					}),
				s1);
		} else {
			return s1;
		}
	}();
	return $elm$core$Platform$Sub$batch(
		A2(
			$elm$core$List$cons,
			$elm$browser$Browser$Events$onResize(
				F2(
					function (w, h) {
						return A2($author$project$Main$ScreenResolution, w, h);
					})),
			s2));
};
var $author$project$Main$AnimatableFloat = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$Main$AnimateModel = function (a) {
	return {$: 15, a: a};
};
var $author$project$Main$MouseDragResolved = F3(
	function (a, b, c) {
		return {$: 9, a: a, b: b, c: c};
	});
var $author$project$Main$Phony = 18;
var $author$project$Main$SetAnimation = F3(
	function (a, b, c) {
		return {$: 11, a: a, b: b, c: c};
	});
var $author$project$Main$fieldToComparable = function (field) {
	switch (field) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		case 3:
			return 3;
		case 4:
			return 4;
		case 5:
			return 5;
		case 6:
			return 6;
		case 7:
			return 7;
		case 8:
			return 8;
		case 9:
			return 9;
		case 10:
			return 10;
		case 11:
			return 11;
		case 12:
			return 12;
		case 13:
			return 13;
		case 14:
			return 14;
		case 15:
			return 15;
		case 16:
			return 16;
		case 17:
			return 17;
		default:
			return 18;
	}
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $author$project$Main$getAnimation = F2(
	function (f, table) {
		return A2(
			$elm$core$Dict$get,
			$author$project$Main$fieldToComparable(f),
			table);
	});
var $author$project$Main$insertAnimation = F3(
	function (f, a, table) {
		return A3(
			$elm$core$Dict$insert,
			$author$project$Main$fieldToComparable(f),
			a,
			table);
	});
var $author$project$Main$mergeAnimations = F2(
	function (prior, _new) {
		return _new;
	});
var $author$project$Main$addAnimationToModel = F4(
	function (name, anim, ttl, model) {
		var _new = {G: anim, bp: 0.0, P: ttl};
		var newDict = A3(
			$author$project$Main$insertAnimation,
			name,
			function () {
				var _v0 = A2($author$project$Main$getAnimation, name, model.i);
				if (!_v0.$) {
					var old = _v0.a;
					return A2($author$project$Main$mergeAnimations, old, _new);
				} else {
					return _new;
				}
			}(),
			model.i);
		return _Utils_update(
			model,
			{i: newDict});
	});
var $author$project$Main$addNew = F2(
	function (x, xs) {
		if (!xs.b) {
			return _List_fromArray(
				[x]);
		} else {
			var y = xs.a;
			var ys = xs.b;
			return _Utils_eq(x, y) ? ys : A2(
				$elm$core$List$cons,
				y,
				A2($author$project$Main$addNew, x, ys));
		}
	});
var $author$project$Main$addPhonyAnim = function (model) {
	var nd = A3(
		$author$project$Main$insertAnimation,
		18,
		{
			G: A3($author$project$Main$AnimatableFloat, 0, 1, 0),
			bp: 0.0,
			P: 1
		},
		model.i);
	return _Utils_update(
		model,
		{i: nd});
};
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $author$project$MouseState$create = function (p) {
	return {
		bE: p,
		bl: _Utils_Tuple2(0, 0),
		cY: p
	};
};
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$float = F2(
	function (a, b) {
		return function (seed0) {
			var seed1 = $elm$random$Random$next(seed0);
			var range = $elm$core$Basics$abs(b - a);
			var n1 = $elm$random$Random$peel(seed1);
			var n0 = $elm$random$Random$peel(seed0);
			var lo = (134217727 & n1) * 1.0;
			var hi = (67108863 & n0) * 1.0;
			var val = ((hi * 134217728.0) + lo) / 9007199254740992.0;
			var scaled = (val * range) + a;
			return _Utils_Tuple2(
				scaled,
				$elm$random$Random$next(seed1));
		};
	});
var $elm$random$Random$Generate = $elm$core$Basics$identity;
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0;
		return A2($elm$random$Random$map, func, generator);
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			A2($elm$random$Random$map, tagger, generator));
	});
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $elm$random$Random$map2 = F3(
	function (func, _v0, _v1) {
		var genA = _v0;
		var genB = _v1;
		return function (seed0) {
			var _v2 = genA(seed0);
			var a = _v2.a;
			var seed1 = _v2.b;
			var _v3 = genB(seed1);
			var b = _v3.a;
			var seed2 = _v3.b;
			return _Utils_Tuple2(
				A2(func, a, b),
				seed2);
		};
	});
var $author$project$MouseState$offsetBy = F2(
	function (p, ms) {
		return _Utils_update(
			ms,
			{bl: p});
	});
var $elm$random$Random$andThen = F2(
	function (callback, _v0) {
		var genA = _v0;
		return function (seed) {
			var _v1 = genA(seed);
			var result = _v1.a;
			var newSeed = _v1.b;
			var _v2 = callback(result);
			var genB = _v2;
			return genB(newSeed);
		};
	});
var $elm$random$Random$constant = function (value) {
	return function (seed) {
		return _Utils_Tuple2(value, seed);
	};
};
var $author$project$CModel$empty = {t: 0, u: 0, v: 0, w: 8.4, x: 1.1, S: 0, T: 0, U: 0, k: 0, l: 0, n: 0, V: 0.00, W: 0.08};
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0;
		return function (seed) {
			return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
		};
	});
var $author$project$CModel$random = A2(
	$elm$random$Random$andThen,
	function (values) {
		if ((((((((((values.b && values.b.b) && values.b.b.b) && values.b.b.b.b) && values.b.b.b.b.b) && values.b.b.b.b.b.b) && values.b.b.b.b.b.b.b) && values.b.b.b.b.b.b.b.b) && values.b.b.b.b.b.b.b.b.b) && values.b.b.b.b.b.b.b.b.b.b) && (!values.b.b.b.b.b.b.b.b.b.b.b)) {
			var pd = values.a;
			var _v1 = values.b;
			var pbraw = _v1.a;
			var _v2 = _v1.b;
			var pwraw = _v2.a;
			var _v3 = _v2.b;
			var caraw = _v3.a;
			var _v4 = _v3.b;
			var baraw = _v4.a;
			var _v5 = _v4.b;
			var pecraw = _v5.a;
			var _v6 = _v5.b;
			var pebraw = _v6.a;
			var _v7 = _v6.b;
			var addraw = _v7.a;
			var _v8 = _v7.b;
			var adbraw = _v8.a;
			var _v9 = _v8.b;
			var adwraw = _v9.a;
			var pw = pwraw / 10;
			var pec = pecraw / 200000;
			var peb = pebraw / 200000;
			var pb = pbraw / 4;
			var ca = 1 + (caraw / 200000);
			var ba = 1 + (baraw / 50000);
			var adw = adwraw / 50000;
			var add = addraw / 10000;
			var adb = adbraw / 10000;
			return $elm$random$Random$constant(
				{t: adb, u: add, v: adw, w: ba, x: ca, S: pb, T: pd, U: pw, k: pb, l: pd, n: pw, V: peb, W: pec});
		} else {
			var otherwise = values;
			return $elm$random$Random$constant($author$project$CModel$empty);
		}
	},
	A2(
		$elm$random$Random$list,
		10,
		A2($elm$random$Random$float, 0, 200000)));
var $author$project$Main$remove = F2(
	function (x, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var y = xs.a;
			var ys = xs.b;
			return _Utils_eq(x, y) ? ys : A2(
				$elm$core$List$cons,
				y,
				A2($author$project$Main$remove, x, ys));
		}
	});
var $author$project$Main$KMsMax = 11;
var $author$project$Main$KMsMin = 12;
var $author$project$Main$CurrentModel = 17;
var $author$project$CModel$averageDistanceBusing = function (m) {
	return m.t;
};
var $author$project$CModel$averageDistanceDriving = function (m) {
	return m.u;
};
var $author$project$CModel$averageDistanceWalking = function (m) {
	return m.v;
};
var $author$project$CModel$busAverageOccupants = function (c) {
	return c.w;
};
var $author$project$CModel$carAverageOccupants = function (c) {
	return c.x;
};
var $author$project$CModel$kmsByBus = function (c) {
	return (c.k * c.t) / c.w;
};
var $author$project$CModel$kmsByCar = function (c) {
	return (c.l * c.u) / c.x;
};
var $author$project$CModel$kmsByWalk = function (c) {
	return c.n * c.v;
};
var $author$project$CModel$deltaBusPeople = function (c) {
	return c.k - c.S;
};
var $author$project$CModel$deltaCarPeople = function (c) {
	return c.l - c.T;
};
var $author$project$CModel$deltaWalkPeople = function (c) {
	return c.n - c.U;
};
var $author$project$CModel$deltaKms = function (c) {
	return ((($author$project$CModel$deltaCarPeople(c) * c.u) / c.x) + (($author$project$CModel$deltaBusPeople(c) * c.t) / c.w)) + ($author$project$CModel$deltaWalkPeople(c) * c.v);
};
var $author$project$CModel$kmsOmitted = function (c) {
	return (-1) * $author$project$CModel$deltaKms(c);
};
var $author$project$CModel$deltaPeople = function (c) {
	return ($author$project$CModel$deltaCarPeople(c) + $author$project$CModel$deltaBusPeople(c)) + $author$project$CModel$deltaWalkPeople(c);
};
var $author$project$CModel$peopleAvoiding = function (m) {
	return (-1) * $author$project$CModel$deltaPeople(m);
};
var $author$project$CModel$peopleBusing = function (m) {
	return m.k;
};
var $author$project$CModel$peopleDriving = function (m) {
	return m.l;
};
var $author$project$CModel$peopleWalking = function (m) {
	return m.n;
};
var $author$project$CModel$percentElectricBus = function (c) {
	return c.V;
};
var $author$project$CModel$percentElectricCar = function (c) {
	return c.W;
};
var $author$project$Main$fieldOp = F4(
	function (proxyFn, nonproxyFn, field, model) {
		var proxy = A2(proxyFn, field, model);
		var nonproxy = A2(nonproxyFn, field, model);
		switch (field) {
			case 0:
				return proxy($author$project$CModel$peopleDriving);
			case 1:
				return proxy($author$project$CModel$peopleBusing);
			case 2:
				return proxy($author$project$CModel$peopleWalking);
			case 3:
				return proxy($author$project$CModel$peopleAvoiding);
			case 4:
				return proxy($author$project$CModel$averageDistanceDriving);
			case 5:
				return proxy($author$project$CModel$averageDistanceBusing);
			case 6:
				return proxy($author$project$CModel$averageDistanceWalking);
			case 7:
				return proxy($author$project$CModel$kmsByCar);
			case 8:
				return proxy($author$project$CModel$kmsByBus);
			case 9:
				return proxy($author$project$CModel$kmsByWalk);
			case 10:
				return proxy($author$project$CModel$kmsOmitted);
			case 11:
				return nonproxy;
			case 12:
				return nonproxy;
			case 13:
				return proxy($author$project$CModel$percentElectricCar);
			case 14:
				return proxy($author$project$CModel$percentElectricBus);
			case 15:
				return proxy($author$project$CModel$carAverageOccupants);
			case 16:
				return proxy($author$project$CModel$busAverageOccupants);
			case 17:
				return nonproxy;
			default:
				return nonproxy;
		}
	});
var $author$project$Main$get = function () {
	var proxy = F3(
		function (f, m, fn) {
			var _v3 = A2($author$project$Main$getAnimation, 17, m.i);
			if (!_v3.$) {
				var anim = _v3.a;
				var _v4 = anim.G;
				if (!_v4.$) {
					var currentValue = _v4.c;
					return -100.0;
				} else {
					var currentValue = _v4.c;
					return fn(currentValue);
				}
			} else {
				return fn(m.ab);
			}
		});
	var nonproxy = F2(
		function (f, m) {
			var _v0 = A2($author$project$Main$getAnimation, f, m.i);
			if (!_v0.$) {
				var anim = _v0.a;
				var _v1 = anim.G;
				if (!_v1.$) {
					var currentValue = _v1.c;
					return currentValue;
				} else {
					var currentValue = _v1.c;
					return 0.0;
				}
			} else {
				switch (f) {
					case 11:
						return m.bg;
					case 12:
						return m.bh;
					default:
						return 0.0;
				}
			}
		});
	return A2($author$project$Main$fieldOp, proxy, nonproxy);
}();
var $author$project$Main$getGround = function () {
	var proxy = F3(
		function (f, m, fn) {
			return fn(m.ab);
		});
	var nonproxy = F2(
		function (f, m) {
			switch (f) {
				case 11:
					return m.bg;
				case 12:
					return m.bh;
				default:
					return 0.0;
			}
		});
	return A2($author$project$Main$fieldOp, proxy, nonproxy);
}();
var $author$project$Bargraph$categories = function (b) {
	return b.a7;
};
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$AverageDistanceBusing = 5;
var $author$project$Main$AverageDistanceDriving = 4;
var $author$project$Main$AverageDistanceWalking = 6;
var $author$project$Main$BusAverageOccupants = 16;
var $author$project$Main$CarAverageOccupants = 15;
var $author$project$Main$KMsByBus = 8;
var $author$project$Main$KMsByCar = 7;
var $author$project$Main$KMsByWalk = 9;
var $author$project$Main$KMsOmitted = 10;
var $author$project$Main$PeopleAvoiding = 3;
var $author$project$Main$PeopleBusing = 1;
var $author$project$Main$PeopleDriving = 0;
var $author$project$Main$PeopleWalking = 2;
var $author$project$Main$PercentElectricBus = 14;
var $author$project$Main$PercentElectricCar = 13;
var $gampleman$elm_visualization$Scale$defaultBandConfig = {db: 0.5, dM: 0.0, dN: 0.0};
var $author$project$Bargraph$bargraph = F3(
	function (n, cs, ts) {
		return {a7: cs, b0: $gampleman$elm_visualization$Scale$defaultBandConfig, cu: n, bv: ts};
	});
var $author$project$Main$vehicleBargraph = function () {
	var tweaks = _List_fromArray(
		[
			_Utils_Tuple2(
			'% Electric',
			_List_fromArray(
				[
					$elm$core$Maybe$Just(13),
					$elm$core$Maybe$Just(14),
					$elm$core$Maybe$Nothing,
					$elm$core$Maybe$Nothing
				])),
			_Utils_Tuple2(
			'Occupancy',
			_List_fromArray(
				[
					$elm$core$Maybe$Just(15),
					$elm$core$Maybe$Just(16),
					$elm$core$Maybe$Nothing,
					$elm$core$Maybe$Nothing
				])),
			_Utils_Tuple2(
			'Avg Distance',
			_List_fromArray(
				[
					$elm$core$Maybe$Just(4),
					$elm$core$Maybe$Just(5),
					$elm$core$Maybe$Just(6),
					$elm$core$Maybe$Nothing
				])),
			_Utils_Tuple2(
			'People',
			_List_fromArray(
				[
					$elm$core$Maybe$Just(0),
					$elm$core$Maybe$Just(1),
					$elm$core$Maybe$Just(2),
					$elm$core$Maybe$Just(3)
				]))
		]);
	var categories = _List_fromArray(
		[7, 8, 9, 10]);
	return A3($author$project$Bargraph$bargraph, 'vbg', categories, tweaks);
}();
var $author$project$Main$kmsMaxExpectedValueFromAccessor = function (fn) {
	var graph = $author$project$Main$vehicleBargraph;
	var values = A2(
		$elm$core$List$map,
		fn,
		$author$project$Bargraph$categories(graph));
	var _v0 = $elm$core$List$maximum(values);
	if (!_v0.$) {
		var value = _v0.a;
		return value;
	} else {
		return 0.0;
	}
};
var $author$project$Main$kmsMaxExpectedValue = function (m) {
	return $author$project$Main$kmsMaxExpectedValueFromAccessor(
		function (f) {
			return A2($author$project$Main$getGround, f, m);
		});
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$kmsMinExpectedValueFromAccessor = function (fn) {
	var graph = $author$project$Main$vehicleBargraph;
	var values = A2(
		$elm$core$List$map,
		fn,
		$author$project$Bargraph$categories(graph));
	var _v0 = $elm$core$List$minimum(values);
	if (!_v0.$) {
		var value = _v0.a;
		return A2($elm$core$Basics$min, 0.0, value);
	} else {
		return 0.0;
	}
};
var $author$project$Main$kmsMinExpectedValue = function (m) {
	return $author$project$Main$kmsMinExpectedValueFromAccessor(
		function (f) {
			return A2($author$project$Main$getGround, f, m);
		});
};
var $author$project$CModel$bound = F3(
	function (minimum, value, maximum) {
		return A2(
			$elm$core$Basics$max,
			A2($elm$core$Basics$min, maximum, value),
			minimum);
	});
var $author$project$CModel$setAverageDistanceBusing = F2(
	function (nv, c) {
		return _Utils_update(
			c,
			{
				t: A3($author$project$CModel$bound, 0.1, nv, 120)
			});
	});
var $author$project$CModel$setAverageDistanceDriving = F2(
	function (nv, c) {
		return _Utils_update(
			c,
			{
				u: A3($author$project$CModel$bound, 0.1, nv, 120)
			});
	});
var $author$project$CModel$setAverageDistanceWalking = F2(
	function (nv, c) {
		return _Utils_update(
			c,
			{
				v: A3($author$project$CModel$bound, 0.1, nv, 120)
			});
	});
var $author$project$CModel$setBusAverageOccupants = F2(
	function (nv, c) {
		return _Utils_update(
			c,
			{
				w: A3($author$project$CModel$bound, 1, nv, 120)
			});
	});
var $author$project$CModel$setCarAverageOccupants = F2(
	function (nv, c) {
		return _Utils_update(
			c,
			{
				x: A3($author$project$CModel$bound, 1, nv, 6)
			});
	});
var $author$project$Main$AnimatableCModel = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $author$project$Main$getCurrentCModel = function (m) {
	var _v0 = A2($author$project$Main$getAnimation, 17, m.i);
	if (!_v0.$) {
		var anim = _v0.a;
		var _v1 = anim.G;
		if (!_v1.$) {
			return m.ab;
		} else {
			var c = _v1.c;
			return c;
		}
	} else {
		return m.ab;
	}
};
var $author$project$Main$setCurrentCModel = F3(
	function (ttl, c, m) {
		var current = $author$project$Main$getCurrentCModel(m);
		var newAnimation = A3($author$project$Main$AnimatableCModel, current, c, current);
		var newAnimations = A3(
			$author$project$Main$insertAnimation,
			17,
			{G: newAnimation, bp: 0.0, P: ttl},
			m.i);
		return _Utils_update(
			m,
			{i: newAnimations, ab: c});
	});
var $author$project$CModel$setKmsByBus = F2(
	function (nv, c) {
		var slackAmount = (-1) * $author$project$CModel$deltaPeople(c);
		var people = (A2($elm$core$Basics$max, nv, 0) * c.w) / c.t;
		var allowableDifference = A3($author$project$CModel$bound, -c.k, people - c.k, slackAmount);
		return _Utils_update(
			c,
			{k: c.k + allowableDifference});
	});
var $author$project$CModel$setKmsByCar = F2(
	function (nv, c) {
		var slackAmount = (-1) * $author$project$CModel$deltaPeople(c);
		var people = (A2($elm$core$Basics$max, nv, 0) * c.x) / c.u;
		var allowableDifference = A3($author$project$CModel$bound, -c.l, people - c.l, slackAmount);
		return _Utils_update(
			c,
			{l: c.l + allowableDifference});
	});
var $author$project$CModel$setKmsByWalk = F2(
	function (nv, c) {
		var slackAmount = (-1) * $author$project$CModel$deltaPeople(c);
		var people = A2($elm$core$Basics$max, nv, 0) / c.v;
		var allowableDifference = A3($author$project$CModel$bound, -c.n, people - c.n, slackAmount);
		return _Utils_update(
			c,
			{n: c.n + allowableDifference});
	});
var $author$project$CModel$setPercentElectricBus = F2(
	function (nv, c) {
		return _Utils_update(
			c,
			{
				V: A3($author$project$CModel$bound, 0, nv, 1)
			});
	});
var $author$project$CModel$setPercentElectricCar = F2(
	function (nv, c) {
		return _Utils_update(
			c,
			{
				W: A3($author$project$CModel$bound, 0, nv, 1)
			});
	});
var $author$project$Main$set = F4(
	function (ttl, nv, field, m) {
		var proxy = function (fn) {
			return A3(
				$author$project$Main$setCurrentCModel,
				ttl,
				A2(fn, nv, m.ab),
				m);
		};
		var andThenAnimateKmsMin = function (model) {
			return A4(
				$author$project$Main$set,
				4000,
				$author$project$Main$kmsMinExpectedValue(model),
				12,
				model);
		};
		var andThenAnimateKmsMax = function (model) {
			return A4(
				$author$project$Main$set,
				4000,
				$author$project$Main$kmsMaxExpectedValue(model),
				11,
				model);
		};
		var andThenAnimateKmsRange = function (model) {
			return andThenAnimateKmsMin(
				andThenAnimateKmsMax(model));
		};
		switch (field) {
			case 17:
				return andThenAnimateKmsRange(m);
			case 18:
				return m;
			case 9:
				return andThenAnimateKmsRange(
					proxy($author$project$CModel$setKmsByWalk));
			case 7:
				return andThenAnimateKmsRange(
					proxy($author$project$CModel$setKmsByCar));
			case 8:
				return andThenAnimateKmsRange(
					proxy($author$project$CModel$setKmsByBus));
			case 11:
				var currently = A2($author$project$Main$get, 11, m);
				return A4(
					$author$project$Main$addAnimationToModel,
					11,
					A3($author$project$Main$AnimatableFloat, currently, nv, currently),
					ttl,
					_Utils_update(
						m,
						{bg: nv}));
			case 12:
				var currently = A2($author$project$Main$get, 12, m);
				return A4(
					$author$project$Main$addAnimationToModel,
					12,
					A3($author$project$Main$AnimatableFloat, currently, nv, currently),
					ttl,
					_Utils_update(
						m,
						{bh: nv}));
			case 13:
				return proxy($author$project$CModel$setPercentElectricCar);
			case 14:
				return proxy($author$project$CModel$setPercentElectricBus);
			case 15:
				return andThenAnimateKmsRange(
					proxy($author$project$CModel$setCarAverageOccupants));
			case 16:
				return andThenAnimateKmsRange(
					proxy($author$project$CModel$setBusAverageOccupants));
			case 4:
				return andThenAnimateKmsRange(
					proxy($author$project$CModel$setAverageDistanceDriving));
			case 6:
				return andThenAnimateKmsRange(
					proxy($author$project$CModel$setAverageDistanceWalking));
			case 5:
				return andThenAnimateKmsRange(
					proxy($author$project$CModel$setAverageDistanceBusing));
			default:
				return m;
		}
	});
var $elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3($elm$core$Dict$insert, k, v, d) : d;
				}),
			$elm$core$Dict$empty,
			dict);
	});
var $author$project$Main$isPlaying = function (a) {
	return a.P > 0.0;
};
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $author$project$CModel$tweenFloat = F3(
	function (percentage, current, target) {
		return ((target - current) * percentage) + current;
	});
var $author$project$CModel$tween = F3(
	function (percentage, c, t) {
		var tw = $author$project$CModel$tweenFloat(percentage);
		return {
			t: A2(tw, c.t, t.t),
			u: A2(tw, c.u, t.u),
			v: A2(tw, c.v, t.v),
			w: A2(tw, c.w, t.w),
			x: A2(tw, c.x, t.x),
			S: A2(tw, c.S, t.S),
			T: A2(tw, c.T, t.T),
			U: A2(tw, c.U, t.U),
			k: A2(tw, c.k, t.k),
			l: A2(tw, c.l, t.l),
			n: A2(tw, c.n, t.n),
			V: A2(tw, c.V, t.V),
			W: A2(tw, c.W, t.W)
		};
	});
var $author$project$Main$tween = F2(
	function (delta, a) {
		var elapsed = A2($elm$core$Basics$min, delta, a.P);
		var percentage = elapsed / a.P;
		var nv = function () {
			var _v0 = a.G;
			if (!_v0.$) {
				var start = _v0.a;
				var target = _v0.b;
				var current = _v0.c;
				return A3(
					$author$project$Main$AnimatableFloat,
					start,
					target,
					A3($author$project$CModel$tweenFloat, percentage, current, target));
			} else {
				var start = _v0.a;
				var target = _v0.b;
				var current = _v0.c;
				return A3(
					$author$project$Main$AnimatableCModel,
					start,
					target,
					A3($author$project$CModel$tween, percentage, current, target));
			}
		}();
		return _Utils_update(
			a,
			{G: nv, P: a.P - elapsed});
	});
var $author$project$Main$tweenAnimations = F2(
	function (a, delta) {
		var _new = A2(
			$elm$core$Dict$map,
			F2(
				function (n, v) {
					return A2($author$project$Main$tween, delta, v);
				}),
			a);
		return A2(
			$elm$core$Dict$filter,
			F2(
				function (n, v) {
					return $author$project$Main$isPlaying(v);
				}),
			_new);
	});
var $author$project$MouseState$update = F2(
	function (p, ms) {
		return _Utils_update(
			ms,
			{bE: p});
	});
var $author$project$Main$updateCurrentModel = F2(
	function (model, m) {
		var current = $author$project$Main$getCurrentCModel(model);
		var _new = {
			G: A3($author$project$Main$AnimatableCModel, current, m, current),
			bp: 0.0,
			P: 250
		};
		var anims = A3($author$project$Main$insertAnimation, 17, _new, model.i);
		return A4(
			$author$project$Main$set,
			0,
			0,
			17,
			_Utils_update(
				model,
				{i: anims, ab: m}));
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		update:
		while (true) {
			switch (msg.$) {
				case 4:
					var r = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aA: A2($author$project$Main$addNew, r, model.aA)
							}),
						$elm$core$Platform$Cmd$none);
				case 5:
					var r = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aA: A2($author$project$Main$remove, r, model.aA)
							}),
						$elm$core$Platform$Cmd$none);
				case 6:
					var r = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aG: A2($author$project$Main$addNew, r, model.aG)
							}),
						$elm$core$Platform$Cmd$none);
				case 7:
					var r = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aG: A2($author$project$Main$remove, r, model.aG)
							}),
						$elm$core$Platform$Cmd$none);
				case 0:
					var time = msg.a;
					var newAnims = A2($author$project$Main$tweenAnimations, model.i, time);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{i: newAnims}),
						$elm$core$Platform$Cmd$none);
				case 1:
					var x = msg.a;
					var y = msg.b;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 2:
					var mx = msg.a;
					var my = msg.b;
					var _v1 = model.aC;
					if (!_v1.$) {
						var ss = _v1.a;
						var newMouseState = A2(
							$author$project$MouseState$update,
							_Utils_Tuple2(mx, my),
							ss.bP);
						var newInteractionState = $elm$core$Maybe$Just(
							_Utils_update(
								ss,
								{bP: newMouseState}));
						var newModel = _Utils_update(
							model,
							{aC: newInteractionState});
						var $temp$msg = ss.b6(newMouseState),
							$temp$model = newModel;
						msg = $temp$msg;
						model = $temp$model;
						continue update;
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 3:
					var x = msg.a;
					var y = msg.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aC: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$none);
				case 9:
					var callback = msg.a;
					var element = msg.b;
					var ms = msg.c;
					var finalms = function () {
						if (!element.$) {
							var value = element.a;
							return A2(
								$author$project$MouseState$offsetBy,
								_Utils_Tuple2(value.dl.fm, value.dl.fp),
								ms);
						} else {
							var err = element.a;
							return ms;
						}
					}();
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aC: $elm$core$Maybe$Just(
									{b6: callback, bP: finalms})
							}),
						$elm$core$Platform$Cmd$none);
				case 8:
					var callback = msg.a;
					var elementId = msg.b;
					var mx = msg.c;
					var my = msg.d;
					return _Utils_Tuple2(
						model,
						A2(
							$elm$core$Task$attempt,
							function (r) {
								return A3(
									$author$project$Main$MouseDragResolved,
									callback,
									r,
									$author$project$MouseState$create(
										_Utils_Tuple2(mx, my)));
							},
							$elm$browser$Browser$Dom$getElement(elementId)));
				case 13:
					var field = msg.a;
					var newValue = msg.b;
					return _Utils_Tuple2(
						A4($author$project$Main$set, 50.0, newValue, field, model),
						$elm$core$Platform$Cmd$none);
				case 12:
					var x = msg.a;
					var y = msg.b;
					var $temp$msg = A3(
						$author$project$Main$SetAnimation,
						18,
						5000.0,
						A3($author$project$Main$AnimatableFloat, 0, x / 500.0, 0)),
						$temp$model = model;
					msg = $temp$msg;
					model = $temp$model;
					continue update;
				case 14:
					var m = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a4: m, ab: m}),
						$elm$core$Platform$Cmd$none);
				case 15:
					var m = msg.a;
					return _Utils_Tuple2(
						A2($author$project$Main$updateCurrentModel, model, m),
						$elm$core$Platform$Cmd$none);
				case 11:
					var name = msg.a;
					var ttl = msg.b;
					var anim = msg.c;
					return _Utils_Tuple2(
						A4($author$project$Main$addAnimationToModel, name, anim, ttl, model),
						$elm$core$Platform$Cmd$none);
				case 10:
					return _Utils_Tuple2(
						$author$project$Main$addPhonyAnim(model),
						A2(
							$elm$random$Random$generate,
							$elm$core$Basics$identity,
							A3(
								$elm$random$Random$map2,
								F2(
									function (x, _v3) {
										return $author$project$Main$AnimateModel(x);
									}),
								$author$project$CModel$random,
								A2($elm$random$Random$float, 50.0, 1000.0))));
				default:
					var $temp$msg = $author$project$Main$AnimateModel(model.a4),
						$temp$model = model;
					msg = $temp$msg;
					model = $temp$model;
					continue update;
			}
		}
	});
var $author$project$Main$Reset = {$: 16};
var $author$project$Main$TestAnimate = {$: 10};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $yotamDvir$elm_katex$Katex$Configs$Math = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $yotamDvir$elm_katex$Katex$Configs$inline = $yotamDvir$elm_katex$Katex$Configs$Math(false);
var $yotamDvir$elm_katex$Katex$inline = A2($elm$core$Basics$composeL, $yotamDvir$elm_katex$Katex$Configs$inline, $elm$core$Basics$always);
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Preliminary$onClick = function (label) {
	return $elm$html$Html$Events$onClick(label);
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $yotamDvir$elm_katex$Katex$Configs$generate = F4(
	function (g, m, h, latex) {
		var g_ = A2(g, m, h);
		if (!latex.$) {
			var f = latex.a;
			return A2(
				g_,
				$elm$core$Maybe$Nothing,
				f(h));
		} else {
			var b = latex.a;
			var f = latex.b;
			var env = b ? 'display' : 'inline';
			return A2(
				g_,
				$elm$core$Maybe$Just(b),
				'$begin-' + (env + ('$' + (f(m) + ('$end-' + (env + '$'))))));
		}
	});
var $yotamDvir$elm_katex$Katex$generate = function (g) {
	return A3(
		$yotamDvir$elm_katex$Katex$Configs$generate,
		F2(
			function (_v0, _v1) {
				return g;
			}),
		'',
		'');
};
var $yotamDvir$elm_katex$Katex$print = $yotamDvir$elm_katex$Katex$generate(
	function (_v0) {
		return $elm$core$Basics$identity;
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Main$Mixed = 2;
var $author$project$Main$Selected = 0;
var $author$project$Main$Unknown = 3;
var $author$project$Main$Unselected = 1;
var $author$project$Main$regionSelected = F2(
	function (m, r) {
		if (!r.$) {
			var _v1 = A2($elm$core$List$member, r, m.aG);
			if (_v1) {
				return 0;
			} else {
				return 1;
			}
		} else {
			var g = r.b;
			return A3(
				$elm$core$List$foldl,
				F2(
					function (child, state) {
						switch (state) {
							case 3:
								return A2($author$project$Main$regionSelected, m, child);
							case 2:
								return 2;
							case 0:
								return (!A2($author$project$Main$regionSelected, m, child)) ? 0 : 2;
							default:
								return (A2($author$project$Main$regionSelected, m, child) === 1) ? 1 : 2;
						}
					}),
				3,
				g);
		}
	});
var $author$project$Main$ExpandRegion = function (a) {
	return {$: 5, a: a};
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$renderCollapsedMixedRegionGroup = F2(
	function (r, n) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$author$project$Preliminary$onClick(
							$author$project$Main$ExpandRegion(r))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('>?')
								])),
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(n)
								]))
						]))
				]));
	});
var $author$project$Main$renderCollapsedSelectedRegionGroup = F2(
	function (r, n) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$author$project$Preliminary$onClick(
							$author$project$Main$ExpandRegion(r))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('>+')
								])),
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(n)
								]))
						]))
				]));
	});
var $author$project$Main$renderCollapsedUnselectedRegionGroup = F2(
	function (r, n) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$author$project$Preliminary$onClick(
							$author$project$Main$ExpandRegion(r))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('>-')
								])),
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(n)
								]))
						]))
				]));
	});
var $author$project$Main$CollapseRegion = function (a) {
	return {$: 4, a: a};
};
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Main$renderExpandedMixedRegionGroup = F3(
	function (r, n, g) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$author$project$Preliminary$onClick(
							$author$project$Main$CollapseRegion(r))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('v?')
								])),
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(n)
								]))
						])),
					A2($elm$html$Html$ul, _List_Nil, g)
				]));
	});
var $author$project$Main$renderExpandedSelectedRegionGroup = F3(
	function (r, n, g) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$author$project$Preliminary$onClick(
							$author$project$Main$CollapseRegion(r))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('v+')
								])),
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(n)
								]))
						])),
					A2($elm$html$Html$ul, _List_Nil, g)
				]));
	});
var $author$project$Main$renderExpandedUnselectedRegionGroup = F3(
	function (r, n, g) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$author$project$Preliminary$onClick(
							$author$project$Main$CollapseRegion(r))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('v-')
								])),
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(n)
								]))
						])),
					A2($elm$html$Html$ul, _List_Nil, g)
				]));
	});
var $author$project$Main$UnselectRegion = function (a) {
	return {$: 7, a: a};
};
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Main$renderSelectedRegionItem = F2(
	function (r, n) {
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'color', 'black'),
					A2($elm$html$Html$Attributes$style, 'user-select', 'none'),
					$author$project$Preliminary$onClick(
					$author$project$Main$UnselectRegion(r))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('[X]')
						])),
					$elm$html$Html$text(n)
				]));
	});
var $author$project$Main$SelectRegion = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$renderUnselectedRegionItem = F2(
	function (r, n) {
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'color', 'gray'),
					A2($elm$html$Html$Attributes$style, 'user-select', 'none'),
					$author$project$Preliminary$onClick(
					$author$project$Main$SelectRegion(r))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('[ ]')
						])),
					$elm$html$Html$text(n)
				]));
	});
var $author$project$Main$renderRegion = F2(
	function (model, r) {
		var selectionState = A2($author$project$Main$regionSelected, model, r);
		if (!r.$) {
			var n = r.a;
			switch (selectionState) {
				case 0:
					return A2($author$project$Main$renderSelectedRegionItem, r, n);
				case 1:
					return A2($author$project$Main$renderUnselectedRegionItem, r, n);
				case 2:
					return A2($author$project$Main$renderUnselectedRegionItem, r, n);
				default:
					return A2($author$project$Main$renderUnselectedRegionItem, r, n);
			}
		} else {
			var n = r.a;
			var g = r.b;
			var collapsed = A2($elm$core$List$member, r, model.aA);
			if (collapsed) {
				switch (selectionState) {
					case 0:
						return A2($author$project$Main$renderCollapsedSelectedRegionGroup, r, n);
					case 1:
						return A2($author$project$Main$renderCollapsedUnselectedRegionGroup, r, n);
					case 2:
						return A2($author$project$Main$renderCollapsedMixedRegionGroup, r, n);
					default:
						return A2($author$project$Main$renderCollapsedMixedRegionGroup, r, n);
				}
			} else {
				var children = A2(
					$elm$core$List$map,
					$author$project$Main$renderRegion(model),
					g);
				switch (selectionState) {
					case 0:
						return A3($author$project$Main$renderExpandedSelectedRegionGroup, r, n, children);
					case 1:
						return A3($author$project$Main$renderExpandedUnselectedRegionGroup, r, n, children);
					case 2:
						return A3($author$project$Main$renderExpandedMixedRegionGroup, r, n, children);
					default:
						return A3($author$project$Main$renderExpandedMixedRegionGroup, r, n, children);
				}
			}
		}
	});
var $author$project$Main$regionDropDown = function (model) {
	return A2($author$project$Main$renderRegion, model, $author$project$Main$regionTree);
};
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $author$project$Bargraph$name = function (b) {
	return b.cu;
};
var $author$project$Main$SetValue = F2(
	function (a, b) {
		return {$: 13, a: a, b: b};
	});
var $gampleman$elm_visualization$Scale$bandwidth = function (_v0) {
	var scale = _v0;
	return scale.bY;
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $gampleman$elm_visualization$Scale$convert = F2(
	function (_v0, value) {
		var scale = _v0;
		return A3(scale.H, scale.b4, scale.z, value);
	});
var $elm$svg$Svg$Attributes$dominantBaseline = _VirtualDom_attribute('dominant-baseline');
var $author$project$Main$fieldToLabel = function (field) {
	switch (field) {
		case 0:
			return 'PeopleDriving';
		case 1:
			return 'PeopleBusing';
		case 2:
			return 'PeopleWalking';
		case 3:
			return 'PeopleAvoiding';
		case 4:
			return 'AverageDistanceDriving';
		case 5:
			return 'AverageDistanceBusing';
		case 6:
			return 'AverageDistanceWalking';
		case 7:
			return 'Automobiles';
		case 8:
			return 'Buses & Trains';
		case 9:
			return 'Bikes & Pedestrians';
		case 10:
			return 'Avoided';
		case 11:
			return 'KMsMax';
		case 12:
			return 'KMsMin';
		case 13:
			return 'PercentElectricCar';
		case 14:
			return 'PercentElectricBus';
		case 15:
			return 'CarAverageOccupants';
		case 16:
			return 'BusAverageOccupants';
		case 17:
			return 'CurrentModel';
		default:
			return 'Phony';
	}
};
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $gampleman$elm_visualization$Scale$invert = F2(
	function (_v0, value) {
		var scale = _v0;
		return A3(scale.bG, scale.b4, scale.z, value);
	});
var $elm$core$List$map3 = _List_map3;
var $author$project$Main$MouseDrag = F4(
	function (a, b, c, d) {
		return {$: 8, a: a, b: b, c: c, d: d};
	});
var $author$project$Preliminary$onMouseDown = function (label) {
	return A2(
		$elm$html$Html$Events$on,
		'mousedown',
		$author$project$Preliminary$mouseCoords(label));
};
var $author$project$Main$onDrag = F2(
	function (id, callback) {
		if (!id.$) {
			var s = id.a;
			return $author$project$Preliminary$onMouseDown(
				F2(
					function (x, y) {
						return A4($author$project$Main$MouseDrag, callback, s, x, y);
					}));
		} else {
			return $author$project$Preliminary$onMouseDown(
				F2(
					function (x, y) {
						return A3(
							$author$project$Main$MouseDragResolved,
							callback,
							$elm$core$Result$Err('null ID'),
							$author$project$MouseState$create(
								_Utils_Tuple2(x, y)));
					}));
		}
	});
var $author$project$Bargraph$spacerBetweenPlotAndTweaks = 30.0;
var $author$project$Bargraph$titleHeight = 60.0;
var $author$project$Bargraph$tweakLabelWidth = 100.0;
var $author$project$Bargraph$tweakRowHeight = 45.0;
var $author$project$Bargraph$plotRectangle = F2(
	function (b, _v0) {
		var width = _v0.a;
		var height = _v0.b;
		return _Utils_Tuple2(
			_Utils_Tuple2($author$project$Bargraph$tweakLabelWidth, $author$project$Bargraph$titleHeight),
			_Utils_Tuple2(
				width,
				(height - $author$project$Bargraph$spacerBetweenPlotAndTweaks) - ($elm$core$List$length(b.bv) * $author$project$Bargraph$tweakRowHeight)));
	});
var $author$project$MouseState$position = function (ms) {
	var _v0 = ms.bl;
	var ox = _v0.a;
	var oy = _v0.b;
	var _v1 = ms.bE;
	var ex = _v1.a;
	var ey = _v1.b;
	return _Utils_Tuple2(ex - ox, ey - oy);
};
var $author$project$Main$animDelta = function () {
	var proxy = F3(
		function (f, m, fn) {
			var _v2 = A2($author$project$Main$getAnimation, 17, m.i);
			if (!_v2.$) {
				var anim = _v2.a;
				var _v3 = anim.G;
				if (!_v3.$) {
					return 0.0;
				} else {
					var end = _v3.b;
					var current = _v3.c;
					return (fn(end) - fn(current)) / (anim.P / 1000);
				}
			} else {
				return 0.0;
			}
		});
	var nonproxy = F2(
		function (f, m) {
			var _v0 = A2($author$project$Main$getAnimation, f, m.i);
			if (!_v0.$) {
				var anim = _v0.a;
				var _v1 = anim.G;
				if (!_v1.$) {
					var end = _v1.b;
					var current = _v1.c;
					return (end - current) / (anim.P / 1000);
				} else {
					return 0.0;
				}
			} else {
				return 0.0;
			}
		});
	return A2($author$project$Main$fieldOp, proxy, nonproxy);
}();
var $elm$core$Basics$round = _Basics_round;
var $author$project$Main$purpleOf = F3(
	function (field, maximum, model) {
		var level = A2(
			$elm$core$Basics$max,
			0,
			A2(
				$elm$core$Basics$min,
				128,
				$elm$core$Basics$abs(
					A2($author$project$Main$animDelta, field, model) / maximum) * 90));
		var lightness = $elm$core$String$fromInt(
			$elm$core$Basics$round(level + 127));
		return 'rgb(' + (lightness + (',0,' + (lightness + ')')));
	});
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$Attributes$textAnchor = _VirtualDom_attribute('text-anchor');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $author$project$Bargraph$titleRectangle = F2(
	function (b, _v0) {
		var width = _v0.a;
		var height = _v0.b;
		return _Utils_Tuple2(
			_Utils_Tuple2($author$project$Bargraph$tweakLabelWidth, 0),
			_Utils_Tuple2(width, $author$project$Bargraph$titleHeight));
	});
var $gampleman$elm_visualization$Scale$Scale = $elm$core$Basics$identity;
var $gampleman$elm_visualization$Scale$toRenderable = F2(
	function (toString, _v0) {
		var scale = _v0;
		return {
			H: F3(
				function (dmn, rng, value) {
					return A3(scale.H, dmn, rng, value) + (A2($elm$core$Basics$max, scale.bY - 1, 0) / 2);
				}),
			b4: scale.b4,
			z: scale.z,
			aW: F2(
				function (_v1, rng) {
					return rng;
				}),
			c_: F2(
				function (_v2, _v3) {
					return toString;
				}),
			c$: F2(
				function (dmn, _v4) {
					return dmn;
				})
		};
	});
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $gampleman$elm_visualization$Scale$Band$normalizeConfig = function (_v0) {
	var paddingInner = _v0.dM;
	var paddingOuter = _v0.dN;
	var align = _v0.db;
	return {
		db: A3($elm$core$Basics$clamp, 0, 1, align),
		dM: A3($elm$core$Basics$clamp, 0, 1, paddingInner),
		dN: A3($elm$core$Basics$clamp, 0, 1, paddingOuter)
	};
};
var $gampleman$elm_visualization$Scale$Band$bandwidth = F3(
	function (cfg, domain, _v0) {
		var d0 = _v0.a;
		var d1 = _v0.b;
		var n = $elm$core$List$length(domain);
		var _v1 = (_Utils_cmp(d0, d1) < 0) ? _Utils_Tuple2(d0, d1) : _Utils_Tuple2(d1, d0);
		var start = _v1.a;
		var stop = _v1.b;
		var _v2 = $gampleman$elm_visualization$Scale$Band$normalizeConfig(cfg);
		var paddingInner = _v2.dM;
		var paddingOuter = _v2.dN;
		var align = _v2.db;
		var step = (stop - start) / A2($elm$core$Basics$max, 1, (n - paddingInner) + (paddingOuter * 2));
		return step * (1 - paddingInner);
	});
var $gampleman$elm_visualization$Scale$Band$computePositions = F4(
	function (index, cfg, n, _v0) {
		var start = _v0.a;
		var stop = _v0.b;
		var _v1 = $gampleman$elm_visualization$Scale$Band$normalizeConfig(cfg);
		var paddingInner = _v1.dM;
		var paddingOuter = _v1.dN;
		var align = _v1.db;
		var step = (stop - start) / A2($elm$core$Basics$max, 1, (n - paddingInner) + (paddingOuter * 2));
		var start2 = start + (((stop - start) - (step * (n - paddingInner))) * align);
		return _Utils_Tuple2(start2, step);
	});
var $gampleman$elm_visualization$Scale$Band$indexOfHelp = F3(
	function (index, value, list) {
		indexOfHelp:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(value, x)) {
					return $elm$core$Maybe$Just(index);
				} else {
					var $temp$index = index + 1,
						$temp$value = value,
						$temp$list = xs;
					index = $temp$index;
					value = $temp$value;
					list = $temp$list;
					continue indexOfHelp;
				}
			}
		}
	});
var $gampleman$elm_visualization$Scale$Band$indexOf = $gampleman$elm_visualization$Scale$Band$indexOfHelp(0);
var $gampleman$elm_visualization$Scale$Band$convert = F4(
	function (cfg, domain, _v0, value) {
		var start = _v0.a;
		var stop = _v0.b;
		var _v1 = A2($gampleman$elm_visualization$Scale$Band$indexOf, value, domain);
		if (!_v1.$) {
			var index = _v1.a;
			var n = $elm$core$List$length(domain);
			if (_Utils_cmp(start, stop) < 0) {
				var _v2 = A4(
					$gampleman$elm_visualization$Scale$Band$computePositions,
					index,
					cfg,
					n,
					_Utils_Tuple2(start, stop));
				var start2 = _v2.a;
				var step = _v2.b;
				return start2 + (step * index);
			} else {
				var _v3 = A4(
					$gampleman$elm_visualization$Scale$Band$computePositions,
					index,
					cfg,
					n,
					_Utils_Tuple2(stop, start));
				var stop2 = _v3.a;
				var step = _v3.b;
				return stop2 + (step * ((n - index) - 1));
			}
		} else {
			return 0 / 0;
		}
	});
var $gampleman$elm_visualization$Scale$band = F3(
	function (config, range_, domain_) {
		return {
			bY: A3($gampleman$elm_visualization$Scale$Band$bandwidth, config, domain_, range_),
			H: $gampleman$elm_visualization$Scale$Band$convert(config),
			b4: domain_,
			z: range_
		};
	});
var $author$project$Bargraph$xScale = F2(
	function (b, sz) {
		var _v0 = A2($author$project$Bargraph$plotRectangle, b, sz);
		var _v1 = _v0.a;
		var plotX0 = _v1.a;
		var plotY0 = _v1.b;
		var _v2 = _v0.b;
		var plotX1 = _v2.a;
		var plotY1 = _v2.b;
		return A3(
			$gampleman$elm_visualization$Scale$band,
			b.b0,
			_Utils_Tuple2(0, plotX1 - plotX0),
			b.a7);
	});
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $gampleman$elm_visualization$Scale$Internal$bimap = F4(
	function (_v0, _v1, deinterpolate, reinterpolate) {
		var d0 = _v0.a;
		var d1 = _v0.b;
		var r0 = _v1.a;
		var r1 = _v1.b;
		var _v2 = (_Utils_cmp(d1, d0) < 0) ? _Utils_Tuple2(
			A2(deinterpolate, d1, d0),
			A2(reinterpolate, r1, r0)) : _Utils_Tuple2(
			A2(deinterpolate, d0, d1),
			A2(reinterpolate, r0, r1));
		var de = _v2.a;
		var re = _v2.b;
		return A2($elm$core$Basics$composeL, re, de);
	});
var $gampleman$elm_visualization$Scale$Linear$deinterpolate = F3(
	function (a, b, x) {
		var normalizedB = b - a;
		return (!normalizedB) ? 0 : ((x - a) / normalizedB);
	});
var $gampleman$elm_visualization$Scale$Internal$interpolateFloat = F3(
	function (from, to, time) {
		return from + ((to - from) * time);
	});
var $gampleman$elm_visualization$Scale$Linear$convert = F2(
	function (domain, range) {
		return A4($gampleman$elm_visualization$Scale$Internal$bimap, domain, range, $gampleman$elm_visualization$Scale$Linear$deinterpolate, $gampleman$elm_visualization$Scale$Internal$interpolateFloat);
	});
var $gampleman$elm_visualization$Scale$Linear$interpolate = $gampleman$elm_visualization$Scale$Internal$interpolateFloat;
var $gampleman$elm_visualization$Scale$Linear$invert = F2(
	function (domain, range) {
		return A4($gampleman$elm_visualization$Scale$Internal$bimap, range, domain, $gampleman$elm_visualization$Scale$Linear$deinterpolate, $gampleman$elm_visualization$Scale$Linear$interpolate);
	});
var $elm$core$Basics$e = _Basics_e;
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Basics$pow = _Basics_pow;
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $gampleman$elm_visualization$Statistics$tickStep = F3(
	function (start, stop, count) {
		var step0 = $elm$core$Basics$abs(stop - start) / A2($elm$core$Basics$max, 0, count);
		var step1 = A2(
			$elm$core$Basics$pow,
			10,
			$elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Basics$e, step0) / A2($elm$core$Basics$logBase, $elm$core$Basics$e, 10)));
		var error = step0 / step1;
		var step2 = (_Utils_cmp(
			error,
			$elm$core$Basics$sqrt(50)) > -1) ? (step1 * 10) : ((_Utils_cmp(
			error,
			$elm$core$Basics$sqrt(10)) > -1) ? (step1 * 5) : ((_Utils_cmp(
			error,
			$elm$core$Basics$sqrt(2)) > -1) ? (step1 * 2) : step1));
		return (_Utils_cmp(stop, start) < 0) ? (-step2) : step2;
	});
var $gampleman$elm_visualization$Scale$Linear$nice = F2(
	function (_v0, count) {
		var start = _v0.a;
		var stop = _v0.b;
		var step0 = A3($gampleman$elm_visualization$Statistics$tickStep, start, stop, count);
		var step1 = A3(
			$gampleman$elm_visualization$Statistics$tickStep,
			$elm$core$Basics$floor(start / step0) * step0,
			$elm$core$Basics$ceiling(stop / step0) * step0,
			count);
		return _Utils_Tuple2(
			$elm$core$Basics$floor(start / step1) * step1,
			$elm$core$Basics$ceiling(stop / step1) * step1);
	});
var $gampleman$elm_visualization$Scale$Linear$rangeExtent = F2(
	function (d, r) {
		return r;
	});
var $gampleman$elm_visualization$Scale$Linear$exponent = function (x) {
	return (!x) ? 0 : ((x < 1) ? (1 + $gampleman$elm_visualization$Scale$Linear$exponent(x * 10)) : 0);
};
var $gampleman$elm_visualization$Scale$Linear$precisionFixed = function (step) {
	return A2(
		$elm$core$Basics$max,
		0,
		$gampleman$elm_visualization$Scale$Linear$exponent(
			$elm$core$Basics$abs(step)));
};
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)));
	});
var $gampleman$elm_visualization$Scale$Internal$toFixed = F2(
	function (precision, value) {
		var power = A2($elm$core$Basics$pow, 10, precision);
		var pad = function (num) {
			_v0$2:
			while (true) {
				if (num.b) {
					if (num.b.b) {
						if (!num.b.b.b) {
							var x = num.a;
							var _v1 = num.b;
							var y = _v1.a;
							return _List_fromArray(
								[
									x,
									A3($elm$core$String$padRight, precision, '0', y)
								]);
						} else {
							break _v0$2;
						}
					} else {
						var val = num.a;
						return (precision > 0) ? _List_fromArray(
							[
								val,
								A3($elm$core$String$padRight, precision, '0', '')
							]) : _List_fromArray(
							[val]);
					}
				} else {
					break _v0$2;
				}
			}
			var val = num;
			return val;
		};
		return A2(
			$elm$core$String$join,
			'.',
			pad(
				A2(
					$elm$core$String$split,
					'.',
					$elm$core$String$fromFloat(
						$elm$core$Basics$round(value * power) / power))));
	});
var $gampleman$elm_visualization$Scale$Linear$tickFormat = F2(
	function (_v0, count) {
		var start = _v0.a;
		var stop = _v0.b;
		return $gampleman$elm_visualization$Scale$Internal$toFixed(
			$gampleman$elm_visualization$Scale$Linear$precisionFixed(
				A3($gampleman$elm_visualization$Statistics$tickStep, start, stop, count)));
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $gampleman$elm_visualization$Statistics$range = F3(
	function (start, stop, step) {
		var n = A2(
			$elm$core$Basics$max,
			0,
			0 | $elm$core$Basics$ceiling((stop - start) / step));
		var helper = F2(
			function (i, list) {
				return (i >= 0) ? A2(
					helper,
					i - 1,
					A2($elm$core$List$cons, start + (step * i), list)) : list;
			});
		return A2(helper, n - 1, _List_Nil);
	});
var $gampleman$elm_visualization$Statistics$ticks = F3(
	function (start, stop, count) {
		var step = A3($gampleman$elm_visualization$Statistics$tickStep, start, stop, count);
		var end = ($elm$core$Basics$floor(stop / step) * step) + (step / 2);
		var beg = $elm$core$Basics$ceiling(start / step) * step;
		return A3($gampleman$elm_visualization$Statistics$range, beg, end, step);
	});
var $gampleman$elm_visualization$Scale$Linear$ticks = F2(
	function (_v0, count) {
		var start = _v0.a;
		var end = _v0.b;
		return A3($gampleman$elm_visualization$Statistics$ticks, start, end, count);
	});
var $gampleman$elm_visualization$Scale$linear = F2(
	function (range_, domain_) {
		return {H: $gampleman$elm_visualization$Scale$Linear$convert, b4: domain_, bG: $gampleman$elm_visualization$Scale$Linear$invert, bk: $gampleman$elm_visualization$Scale$Linear$nice, z: range_, aW: $gampleman$elm_visualization$Scale$Linear$rangeExtent, c_: $gampleman$elm_visualization$Scale$Linear$tickFormat, c$: $gampleman$elm_visualization$Scale$Linear$ticks};
	});
var $author$project$Bargraph$yScale = F3(
	function (b, sz, range) {
		var _v0 = A2($author$project$Bargraph$plotRectangle, b, sz);
		var _v1 = _v0.a;
		var plotX0 = _v1.a;
		var plotY0 = _v1.b;
		var _v2 = _v0.b;
		var plotX1 = _v2.a;
		var plotY1 = _v2.b;
		return A2(
			$gampleman$elm_visualization$Scale$linear,
			_Utils_Tuple2(plotY1 - plotY0, 0),
			range);
	});
var $author$project$Main$renderBargraphBars = F3(
	function (model, b, sz) {
		var xscale = A2($author$project$Bargraph$xScale, b, sz);
		var valueOf = function (f) {
			return A2($author$project$Main$get, f, model);
		};
		var values = A2(
			$elm$core$List$map,
			valueOf,
			$author$project$Bargraph$categories(b));
		var theMin = A2($author$project$Main$get, 12, model);
		var theMax = A2($author$project$Main$get, 11, model);
		var yscale = A3(
			$author$project$Bargraph$yScale,
			b,
			sz,
			_Utils_Tuple2(theMin, theMax));
		var labelOf = F2(
			function (f, v) {
				return $elm$core$String$fromInt(
					$elm$core$Basics$round(v));
			});
		var id = $author$project$Bargraph$name(b);
		var isDraggable = function (f) {
			var _v10 = _Utils_Tuple2(id, f);
			if (_v10.b === 10) {
				var _v11 = _v10.b;
				return false;
			} else {
				return true;
			}
		};
		var labelStyle = function (f) {
			var _v9 = isDraggable(f);
			if (_v9) {
				return 'cursor:ns-resize';
			} else {
				return '';
			}
		};
		var barColor = function (f) {
			var _v8 = isDraggable(f);
			if (_v8) {
				return A3($author$project$Main$purpleOf, f, theMax, model);
			} else {
				return 'gray';
			}
		};
		var barStyle = function (f) {
			return function () {
				var _v7 = isDraggable(f);
				if (_v7) {
					return 'cursor:ns-resize; ';
				} else {
					return '';
				}
			}() + ('fill:' + barColor(f));
		};
		var _v0 = A2($author$project$Bargraph$titleRectangle, b, sz);
		var _v1 = _v0.a;
		var titleX0 = _v1.a;
		var titleY0 = _v1.b;
		var _v2 = _v0.b;
		var titleX1 = _v2.a;
		var titleY1 = _v2.b;
		var _v3 = A2($author$project$Bargraph$plotRectangle, b, sz);
		var _v4 = _v3.a;
		var plotX0 = _v4.a;
		var plotY0 = _v4.b;
		var _v5 = _v3.b;
		var plotX1 = _v5.a;
		var plotY1 = _v5.b;
		var dragAttribute = function (f) {
			var _v6 = isDraggable(f);
			if (_v6) {
				return _List_fromArray(
					[
						A2(
						$author$project$Main$onDrag,
						$elm$core$Maybe$Just(id),
						function (ms) {
							return A2(
								$author$project$Main$SetValue,
								f,
								A2(
									$gampleman$elm_visualization$Scale$invert,
									yscale,
									$author$project$MouseState$position(ms).b - plotY0));
						})
					]);
			} else {
				return _List_Nil;
			}
		};
		var renderBar = F3(
			function (field, value, label) {
				var y = plotY0 + A2($gampleman$elm_visualization$Scale$convert, yscale, value);
				var height = (plotY1 - plotY0) - A2($gampleman$elm_visualization$Scale$convert, yscale, value + theMin);
				var labely = ((height < 0) ? 12 : (-8)) + y;
				var finaly = (height < 0) ? (plotY0 + A2($gampleman$elm_visualization$Scale$convert, yscale, 0)) : y;
				var finalheight = $elm$core$Basics$abs(height);
				return _List_fromArray(
					[
						A2(
						$elm$svg$Svg$rect,
						_Utils_ap(
							dragAttribute(field),
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x(
									$elm$core$String$fromFloat(
										(plotX0 + (0.1 * $gampleman$elm_visualization$Scale$bandwidth(xscale))) + A2($gampleman$elm_visualization$Scale$convert, xscale, field))),
									$elm$svg$Svg$Attributes$y(
									$elm$core$String$fromFloat(finaly)),
									$elm$svg$Svg$Attributes$width(
									$elm$core$String$fromFloat(
										0.8 * $gampleman$elm_visualization$Scale$bandwidth(xscale))),
									$elm$svg$Svg$Attributes$height(
									$elm$core$String$fromFloat(finalheight)),
									$elm$svg$Svg$Attributes$style(
									barStyle(field))
								])),
						_List_Nil),
						A2(
						$elm$svg$Svg$text_,
						_Utils_ap(
							dragAttribute(field),
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x(
									$elm$core$String$fromFloat(
										plotX0 + A2(
											$gampleman$elm_visualization$Scale$convert,
											A2($gampleman$elm_visualization$Scale$toRenderable, $author$project$Main$fieldToLabel, xscale),
											field))),
									$elm$svg$Svg$Attributes$y(
									$elm$core$String$fromFloat(labely)),
									$elm$svg$Svg$Attributes$style(
									labelStyle(field)),
									$elm$svg$Svg$Attributes$textAnchor('middle'),
									$elm$svg$Svg$Attributes$dominantBaseline('middle')
								])),
						_List_fromArray(
							[
								$elm$html$Html$text(label)
							]))
					]);
			});
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			$elm$core$List$concat(
				A4(
					$elm$core$List$map3,
					renderBar,
					$author$project$Bargraph$categories(b),
					values,
					A3(
						$elm$core$List$map2,
						labelOf,
						$author$project$Bargraph$categories(b),
						values))));
	});
var $author$project$Main$renderBargraphTitle = F2(
	function (b, sz) {
		var label = function () {
			var _v3 = $author$project$Bargraph$name(b);
			if (_v3 === 'vbg') {
				return 'Kilometers Undertaken By...';
			} else {
				return 'Unknown';
			}
		}();
		var _v0 = A2($author$project$Bargraph$titleRectangle, b, sz);
		var _v1 = _v0.a;
		var titleX0 = _v1.a;
		var titleY0 = _v1.b;
		var _v2 = _v0.b;
		var titleX1 = _v2.a;
		var titleY1 = _v2.b;
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$textAnchor('middle'),
					$elm$svg$Svg$Attributes$dominantBaseline('middle'),
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(((titleX1 - titleX0) / 2) + titleX0)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(((titleY1 - titleY0) / 2) + titleY0)),
					$elm$svg$Svg$Attributes$style('font-weight:bold')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$Bargraph$tweakRowLabelRectangle = F3(
	function (b, _v0, i) {
		var width = _v0.a;
		var height = _v0.b;
		return _Utils_Tuple2(
			_Utils_Tuple2(0, height - ((i + 1) * $author$project$Bargraph$tweakRowHeight)),
			_Utils_Tuple2($author$project$Bargraph$tweakLabelWidth, height - (i * $author$project$Bargraph$tweakRowHeight)));
	});
var $author$project$Bargraph$tweaks = function (b) {
	return b.bv;
};
var $author$project$Main$renderBargraphTweakLabels = F3(
	function (model, b, sz) {
		var renderLabel = F2(
			function (row, label) {
				var _v0 = A3($author$project$Bargraph$tweakRowLabelRectangle, b, sz, row);
				var _v1 = _v0.a;
				var tweakX0 = _v1.a;
				var tweakY0 = _v1.b;
				var _v2 = _v0.b;
				var tweakX1 = _v2.a;
				var tweakY1 = _v2.b;
				return A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$textAnchor('end'),
							$elm$svg$Svg$Attributes$dominantBaseline('middle'),
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(tweakX1)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(((tweakY1 - tweakY0) / 2) + tweakY0))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						]));
			});
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			A2(
				$elm$core$List$indexedMap,
				renderLabel,
				A2(
					$elm$core$List$map,
					$elm$core$Tuple$first,
					$author$project$Bargraph$tweaks(b))));
	});
var $author$project$MouseState$dragStart = function (ms) {
	var _v0 = ms.cY;
	var sx = _v0.a;
	var sy = _v0.b;
	var _v1 = ms.bl;
	var ox = _v1.a;
	var oy = _v1.b;
	return _Utils_Tuple2(sx - ox, sy - oy);
};
var $elm$svg$Svg$Attributes$fontSize = _VirtualDom_attribute('font-size');
var $author$project$Main$kmsMaxExpectedValueBaseline = function (m) {
	return $author$project$Main$kmsMaxExpectedValueFromAccessor(
		function (f) {
			return A2(
				$author$project$Main$cyclic$getBaseline(),
				f,
				m);
		});
};
var $author$project$Main$kmsMinExpectedValueBaseline = function (m) {
	return $author$project$Main$kmsMinExpectedValueFromAccessor(
		function (f) {
			return A2(
				$author$project$Main$cyclic$getBaseline(),
				f,
				m);
		});
};
function $author$project$Main$cyclic$getBaseline() {
	var proxy = F3(
		function (f, m, fn) {
			return fn(m.a4);
		});
	var nonproxy = F2(
		function (f, m) {
			switch (f) {
				case 11:
					return $author$project$Main$kmsMaxExpectedValueBaseline(m);
				case 12:
					return $author$project$Main$kmsMinExpectedValueBaseline(m);
				default:
					return 0.0;
			}
		});
	return A2($author$project$Main$fieldOp, proxy, nonproxy);
}
var $author$project$Main$getBaseline = $author$project$Main$cyclic$getBaseline();
$author$project$Main$cyclic$getBaseline = function () {
	return $author$project$Main$getBaseline;
};
var $author$project$Main$getDelta = F2(
	function (f, m) {
		return A2($author$project$Main$get, f, m) - A2($author$project$Main$getBaseline, f, m);
	});
var $author$project$Bargraph$tweakRowColumnRectangle = F4(
	function (b, _v0, r, c) {
		var width = _v0.a;
		var height = _v0.b;
		var totalWidth = width - $author$project$Bargraph$tweakLabelWidth;
		var totalCategories = $elm$core$List$length(b.a7);
		var sizePerCategory = totalWidth / totalCategories;
		return _Utils_Tuple2(
			_Utils_Tuple2($author$project$Bargraph$tweakLabelWidth + (c * sizePerCategory), height - ((r + 1) * $author$project$Bargraph$tweakRowHeight)),
			_Utils_Tuple2($author$project$Bargraph$tweakLabelWidth + ((c + 1) * sizePerCategory), height - (r * $author$project$Bargraph$tweakRowHeight)));
	});
var $author$project$Main$renderBargraphTweakValues = F3(
	function (model, b, sz) {
		var withOneDecimal = function (v) {
			return $elm$core$String$fromFloat(
				$elm$core$Basics$round(10 * v) / 10);
		};
		var scaleOf = function (f) {
			switch (f) {
				case 14:
					return -0.004;
				case 13:
					return -0.004;
				case 15:
					return -0.1;
				case 16:
					return -0.4;
				case 4:
					return -0.05;
				case 5:
					return -0.05;
				case 6:
					return -0.05;
				default:
					return -1.0;
			}
		};
		var isDraggable = function (f) {
			var _v13 = _Utils_Tuple2(
				$author$project$Bargraph$name(b),
				f);
			switch (_v13.b) {
				case 13:
					var _v14 = _v13.b;
					return true;
				case 14:
					var _v15 = _v13.b;
					return true;
				case 4:
					var _v16 = _v13.b;
					return true;
				case 5:
					var _v17 = _v13.b;
					return true;
				case 6:
					var _v18 = _v13.b;
					return true;
				case 15:
					var _v19 = _v13.b;
					return true;
				case 16:
					var _v20 = _v13.b;
					return true;
				default:
					return false;
			}
		};
		var styleOf = function (f) {
			var _v11 = isDraggable(f);
			if (_v11) {
				var maximum = 1.0;
				var color = A3($author$project$Main$purpleOf, f, maximum, model);
				return 'fill:' + (color + '; cursor:ns-resize; text-decoration-line:  overline; text-decoration-style: wavy');
			} else {
				return 'fill:black';
			}
		};
		var dragAttribute = function (f) {
			var _v10 = isDraggable(f);
			if (_v10) {
				return _List_fromArray(
					[
						A2(
						$author$project$Main$onDrag,
						$elm$core$Maybe$Nothing,
						function (ms) {
							return A2(
								$author$project$Main$SetValue,
								f,
								A2($author$project$Main$get, f, model) + (scaleOf(f) * ($author$project$MouseState$position(ms).b - $author$project$MouseState$dragStart(ms).b)));
						})
					]);
			} else {
				return _List_Nil;
			}
		};
		var asPercent = function (v) {
			return $elm$core$String$fromFloat(
				$elm$core$Basics$round(1000 * v) / 10) + '%';
		};
		var displayValue = F2(
			function (f, v) {
				switch (f) {
					case 13:
						return asPercent(v);
					case 14:
						return asPercent(v);
					case 4:
						return withOneDecimal(v);
					case 5:
						return withOneDecimal(v);
					case 6:
						return withOneDecimal(v);
					case 15:
						return withOneDecimal(v);
					case 16:
						return withOneDecimal(v);
					default:
						return $elm$core$String$fromInt(
							$elm$core$Basics$round(v));
				}
			});
		var renderSub = F3(
			function (row, column, field) {
				if (!field.$) {
					var f = field.a;
					var value = A2($author$project$Main$getDelta, f, model);
					var label = A2(
						displayValue,
						f,
						$elm$core$Basics$abs(value));
					if (!value) {
						return $elm$core$Maybe$Nothing;
					} else {
						var _v6 = A4($author$project$Bargraph$tweakRowColumnRectangle, b, sz, row, column);
						var _v7 = _v6.a;
						var tweakX0 = _v7.a;
						var tweakY0 = _v7.b;
						var _v8 = _v6.b;
						var tweakX1 = _v8.a;
						var tweakY1 = _v8.b;
						return $elm$core$Maybe$Just(
							A2(
								$elm$svg$Svg$text_,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$textAnchor('middle'),
										$elm$svg$Svg$Attributes$dominantBaseline('middle'),
										$elm$svg$Svg$Attributes$fontSize('smaller'),
										$elm$svg$Svg$Attributes$style(
										(value > 0) ? 'fill: blue' : 'fill: red'),
										$elm$svg$Svg$Attributes$x(
										$elm$core$String$fromFloat(((tweakX1 - tweakX0) / 2) + tweakX0)),
										$elm$svg$Svg$Attributes$y(
										$elm$core$String$fromFloat((15 + ((tweakY1 - tweakY0) / 2)) + tweakY0))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										(value > 0) ? (label + ' more') : (label + ' less'))
									])));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			});
		var renderSubtext = F2(
			function (row, fields) {
				return A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					A2(
						$elm$core$List$indexedMap,
						renderSub(row),
						fields));
			});
		var valueOf = function (f) {
			return A2(
				displayValue,
				f,
				A2($author$project$Main$get, f, model));
		};
		var renderValue = F3(
			function (row, column, field) {
				if (field.$ === 1) {
					return $elm$core$Maybe$Nothing;
				} else {
					var f = field.a;
					var _v1 = A4($author$project$Bargraph$tweakRowColumnRectangle, b, sz, row, column);
					var _v2 = _v1.a;
					var tweakX0 = _v2.a;
					var tweakY0 = _v2.b;
					var _v3 = _v1.b;
					var tweakX1 = _v3.a;
					var tweakY1 = _v3.b;
					var _v4 = _Utils_Tuple2(
						$author$project$Bargraph$name(b),
						field);
					return $elm$core$Maybe$Just(
						A2(
							$elm$svg$Svg$text_,
							_Utils_ap(
								dragAttribute(f),
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$textAnchor('middle'),
										$elm$svg$Svg$Attributes$dominantBaseline('middle'),
										$elm$svg$Svg$Attributes$style(
										styleOf(f)),
										$elm$svg$Svg$Attributes$x(
										$elm$core$String$fromFloat(((tweakX1 - tweakX0) / 2) + tweakX0)),
										$elm$svg$Svg$Attributes$y(
										$elm$core$String$fromFloat(((tweakY1 - tweakY0) / 2) + tweakY0))
									])),
							_List_fromArray(
								[
									$elm$html$Html$text(
									valueOf(f))
								])));
				}
			});
		var renderRow = F2(
			function (row, fields) {
				return A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					A2(
						$elm$core$List$indexedMap,
						renderValue(row),
						fields));
			});
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_Utils_ap(
				$elm$core$List$concat(
					A2(
						$elm$core$List$indexedMap,
						renderRow,
						A2(
							$elm$core$List$map,
							$elm$core$Tuple$second,
							$author$project$Bargraph$tweaks(b)))),
				$elm$core$List$concat(
					A2(
						$elm$core$List$indexedMap,
						renderSubtext,
						A2(
							$elm$core$List$map,
							$elm$core$Tuple$second,
							$author$project$Bargraph$tweaks(b))))));
	});
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $gampleman$elm_visualization$Scale$tickFormat = function (_v0) {
	var opts = _v0;
	return opts.c_(opts.b4);
};
var $gampleman$elm_visualization$Scale$ticks = F2(
	function (_v0, count) {
		var scale = _v0;
		return A2(scale.c$, scale.b4, count);
	});
var $gampleman$elm_visualization$Axis$computeOptions = F2(
	function (attrs, scale) {
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (attr, _v1) {
					var babyOpts = _v1.a;
					var post = _v1.b;
					switch (attr.$) {
						case 2:
							var val = attr.a;
							return _Utils_Tuple2(
								_Utils_update(
									babyOpts,
									{a$: val}),
								post);
						case 3:
							var val = attr.a;
							return _Utils_Tuple2(
								_Utils_update(
									babyOpts,
									{a0: val}),
								post);
						case 4:
							var val = attr.a;
							return _Utils_Tuple2(
								_Utils_update(
									babyOpts,
									{aw: val}),
								post);
						case 5:
							var val = attr.a;
							return _Utils_Tuple2(
								_Utils_update(
									babyOpts,
									{br: val}),
								post);
						default:
							return _Utils_Tuple2(
								babyOpts,
								A2($elm$core$List$cons, attr, post));
					}
				}),
			_Utils_Tuple2(
				{a$: 10, br: 3, a0: 6, aw: 6},
				_List_Nil),
			attrs);
		var opts = _v0.a;
		var postList = _v0.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (attr, options) {
					switch (attr.$) {
						case 0:
							var val = attr.a;
							return _Utils_update(
								options,
								{c$: val});
						case 1:
							var val = attr.a;
							return _Utils_update(
								options,
								{c_: val});
						default:
							return options;
					}
				}),
			{
				a$: opts.a$,
				c_: A2($gampleman$elm_visualization$Scale$tickFormat, scale, opts.a$),
				br: opts.br,
				a0: opts.a0,
				aw: opts.aw,
				c$: A2($gampleman$elm_visualization$Scale$ticks, scale, opts.a$)
			},
			postList);
	});
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$Attributes$dy = _VirtualDom_attribute('dy');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$fontFamily = _VirtualDom_attribute('font-family');
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $gampleman$elm_visualization$Scale$rangeExtent = function (_v0) {
	var options = _v0;
	return A2(options.aW, options.b4, options.z);
};
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $gampleman$elm_visualization$Axis$element = F4(
	function (_v0, k, displacement, textAnchorPosition) {
		var x = _v0.fm;
		var y = _v0.fp;
		var x1 = _v0.c5;
		var x2 = _v0.c6;
		var y1 = _v0.c7;
		var y2 = _v0.c8;
		var translate = _v0.c1;
		var horizontal = _v0.b8;
		return F2(
			function (attrs, scale) {
				var rangeExtent = $gampleman$elm_visualization$Scale$rangeExtent(scale);
				var range1 = rangeExtent.b + 0.5;
				var range0 = rangeExtent.a + 0.5;
				var position = $gampleman$elm_visualization$Scale$convert(scale);
				var opts = A2($gampleman$elm_visualization$Axis$computeOptions, attrs, scale);
				var spacing = A2($elm$core$Basics$max, opts.a0, 0) + opts.br;
				var drawTick = function (tick) {
					return A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$class('tick'),
								$elm$svg$Svg$Attributes$transform(
								translate(
									position(tick)))
							]),
						_List_fromArray(
							[
								A2(
								$elm$svg$Svg$line,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$stroke('#000'),
										x2(k * opts.a0),
										y1(0.5),
										y2(0.5)
									]),
								_List_Nil),
								A2(
								$elm$svg$Svg$text_,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$fill('#000'),
										x(k * spacing),
										y(0.5),
										$elm$svg$Svg$Attributes$dy(displacement)
									]),
								_List_fromArray(
									[
										$elm$svg$Svg$text(
										opts.c_(tick))
									]))
							]));
				};
				var domainLine = horizontal ? ('M' + ($elm$core$String$fromFloat(k * opts.aw) + (',' + ($elm$core$String$fromFloat(range0) + ('H0.5V' + ($elm$core$String$fromFloat(range1) + ('H' + $elm$core$String$fromFloat(k * opts.aw)))))))) : ('M' + ($elm$core$String$fromFloat(range0) + (',' + ($elm$core$String$fromFloat(k * opts.aw) + ('V0.5H' + ($elm$core$String$fromFloat(range1) + ('V' + $elm$core$String$fromFloat(k * opts.aw))))))));
				return A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill('none'),
							$elm$svg$Svg$Attributes$fontSize('10'),
							$elm$svg$Svg$Attributes$fontFamily('sans-serif'),
							$elm$svg$Svg$Attributes$textAnchor(textAnchorPosition)
						]),
					A2(
						$elm$core$List$cons,
						A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('domain'),
									$elm$svg$Svg$Attributes$stroke('#000'),
									$elm$svg$Svg$Attributes$d(domainLine)
								]),
							_List_Nil),
						A2($elm$core$List$map, drawTick, opts.c$)));
			});
	});
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $gampleman$elm_visualization$Axis$verticalAttrs = {
	b8: false,
	c1: function (x) {
		return 'translate(' + ($elm$core$String$fromFloat(x) + ', 0)');
	},
	fm: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y, $elm$core$String$fromFloat),
	c5: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y1, $elm$core$String$fromFloat),
	c6: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y2, $elm$core$String$fromFloat),
	fp: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x, $elm$core$String$fromFloat),
	c7: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x1, $elm$core$String$fromFloat),
	c8: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x2, $elm$core$String$fromFloat)
};
var $gampleman$elm_visualization$Axis$bottom = A4($gampleman$elm_visualization$Axis$element, $gampleman$elm_visualization$Axis$verticalAttrs, 1, '0.71em', 'middle');
var $author$project$Main$renderBargraphXAxis = F3(
	function (model, b, sz) {
		var xscale = A2($author$project$Bargraph$xScale, b, sz);
		var theMin = A2($author$project$Main$get, 12, model);
		var theMax = A2($author$project$Main$get, 11, model);
		var yscale = A3(
			$author$project$Bargraph$yScale,
			b,
			sz,
			_Utils_Tuple2(theMin, theMax));
		var _v0 = A2($author$project$Bargraph$plotRectangle, b, sz);
		var _v1 = _v0.a;
		var plotX0 = _v1.a;
		var plotY0 = _v1.b;
		var _v2 = _v0.b;
		var plotX1 = _v2.a;
		var plotY1 = _v2.b;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$transform(
					'translate(' + ($elm$core$String$fromFloat(plotX0) + (',' + ($elm$core$String$fromFloat(
						plotY0 + A2($gampleman$elm_visualization$Scale$convert, yscale, 0)) + ')'))))
				]),
			_List_fromArray(
				[
					A2(
					$gampleman$elm_visualization$Axis$bottom,
					_List_Nil,
					A2($gampleman$elm_visualization$Scale$toRenderable, $author$project$Main$fieldToLabel, xscale))
				]));
	});
var $gampleman$elm_visualization$Axis$horizontalAttrs = {
	b8: true,
	c1: function (y) {
		return 'translate(0, ' + ($elm$core$String$fromFloat(y) + ')');
	},
	fm: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x, $elm$core$String$fromFloat),
	c5: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x1, $elm$core$String$fromFloat),
	c6: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$x2, $elm$core$String$fromFloat),
	fp: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y, $elm$core$String$fromFloat),
	c7: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y1, $elm$core$String$fromFloat),
	c8: A2($elm$core$Basics$composeL, $elm$svg$Svg$Attributes$y2, $elm$core$String$fromFloat)
};
var $gampleman$elm_visualization$Axis$left = A4($gampleman$elm_visualization$Axis$element, $gampleman$elm_visualization$Axis$horizontalAttrs, -1, '0.32em', 'end');
var $author$project$Main$renderBargraphYAxis = F3(
	function (model, b, sz) {
		var values = A2(
			$elm$core$List$map,
			function (f) {
				return A2($author$project$Main$get, f, model);
			},
			$author$project$Bargraph$categories(b));
		var theMin = A2($author$project$Main$get, 12, model);
		var theMax = A2($author$project$Main$get, 11, model);
		var yscale = A3(
			$author$project$Bargraph$yScale,
			b,
			sz,
			_Utils_Tuple2(theMin, theMax));
		var _v0 = A2($author$project$Bargraph$plotRectangle, b, sz);
		var _v1 = _v0.a;
		var plotX0 = _v1.a;
		var plotY0 = _v1.b;
		var _v2 = _v0.b;
		var plotX1 = _v2.a;
		var plotY1 = _v2.b;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$transform(
					'translate(' + ($elm$core$String$fromFloat(plotX0) + (',' + ($elm$core$String$fromFloat(plotY0) + ')'))))
				]),
			_List_fromArray(
				[
					A2($gampleman$elm_visualization$Axis$left, _List_Nil, yscale)
				]));
	});
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Main$renderBargraph = F3(
	function (model, b, sz) {
		var w = $elm$core$String$fromFloat(sz.a);
		var h = $elm$core$String$fromFloat(sz.b);
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$id(
					$author$project$Bargraph$name(b)),
					$elm$svg$Svg$Attributes$width(w),
					$elm$svg$Svg$Attributes$height(h),
					$elm$svg$Svg$Attributes$viewBox('0 0 ' + (w + (' ' + h))),
					$elm$svg$Svg$Attributes$style('user-select: none')
				]),
			_List_fromArray(
				[
					A2($author$project$Main$renderBargraphTitle, b, sz),
					A3($author$project$Main$renderBargraphYAxis, model, b, sz),
					A3($author$project$Main$renderBargraphTweakLabels, model, b, sz),
					A3($author$project$Main$renderBargraphTweakValues, model, b, sz),
					A3($author$project$Main$renderBargraphBars, model, b, sz),
					A3($author$project$Main$renderBargraphXAxis, model, b, sz)
				]));
	});
var $author$project$Main$testDiv = F2(
	function (a, s) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							a,
							A2($elm$html$Html$Attributes$style, 'border', '1px solid black')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(s)
						]))
				]));
	});
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Main$regionDropDown(model),
				A2(
				$author$project$Main$testDiv,
				$author$project$Preliminary$onClick($author$project$Main$TestAnimate),
				'Test animation'),
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Transporation')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$author$project$Preliminary$onClick($author$project$Main$Reset)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Reset')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('I take public transit to work; I like it, it gives me time to read. Before we moved to Coquitlam, I walked to work, and that was nice too.')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('(this blurb will computed based on region. Fuzzy logic depending on the breakdown of travel modes) In coquitlam, the majority of commutes are by car and that\'s a big source of CO2 emissions. It\'s also a big chunk of household budgets, and a source of stress.')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('The 2016 census can tell us a lot about commuting patterns:')
					])),
				A3(
				$author$project$Main$renderBargraph,
				model,
				$author$project$Main$vehicleBargraph,
				_Utils_Tuple2(600, 600)),
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Calculations')
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$yotamDvir$elm_katex$Katex$print(
							$yotamDvir$elm_katex$Katex$inline(
								'x^2 + y = \\sqrt{' + ($elm$core$String$fromFloat(
									A2($author$project$Main$get, 6, model)) + '}'))))
					]))
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{eK: $author$project$Main$init, e8: $author$project$Main$subscriptions, fi: $author$project$Main$update, fj: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));