// Replace simple functions with older methods
String.prototype.includes = function (string) {
    return this.indexOf(string) > -1;
};

String.prototype.startsWith = function (string) {
    return this.indexOf(string) == 0;
};

String.prototype.endsWith = function (string) {
    return this.lastIndexOf(string) == this.length - string.length;
};

function arrayHas(array, thing) {
	return array.indexOf(thing) > -1;
}

String.prototype.repeat = function (num) {
    var it = this;
    for (var i = 0; i < num - 1; i++) {
    	it += it;
    }
    return it;
};