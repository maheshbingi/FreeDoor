var Map = function () {
	this.map = {};
}

Map.prototype.add = function(key, value) {
    if(value != undefined) {
    	this.map[key] = value;
    }
}

Map.prototype.getMap = function() {
    return this.map;
}

module.exports = Map;