var arguments = process.argv.splice(2);

var http = require('http'), httpProxy = require('http-proxy'), path = require('path');

var http = require('http'), httpProxy = require('http-proxy'), path = require('path');
var seaport = require('seaport');
var ports = seaport.connect('192.168.0.150', 9090);
var url = '';
var i = -1;
var proxy = httpProxy.createProxyServer({});
var requestCount = 0;
http.createServer(function(req, res) {
	var addresses = ports.query();

	if (!addresses.length) {
		res.writeHead(503, {
			'Content-Type' : 'text/plain'
		});
		res.end('Service unavailable');
		return;
	}

	i = (i + 1) % addresses.length;

	url = 'http://' + addresses[i].host + ':' + addresses[i].port + '';
	
	requestCount++;
	console.log("Forwarding request " + requestCount + " to: " + url);
	proxy.web(req, res, {
		target : url
	});
}).listen(8080);

console.log('Load balancer listening on port 8080');

