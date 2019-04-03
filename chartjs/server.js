// nodeのコアモジュールのhttpを使う
var http = require('http');
var client = require('cheerio-httpcli');
var server = http.createServer();

var url = 'https://stocks.finance.yahoo.co.jp/stocks/detail/?code=^DJI'


setInterval(function() {
  client.fetch( url, {}, function( err, $, res ){
    value = $('td[class=stoksPrice]').html()
    value = value.replace(/,/g, "");
    console.log(value)
  });
}, 1000);


server.on('request', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Request-Method', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.write(value);
    res.end();
});

server.listen(3000);