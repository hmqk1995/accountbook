var connect = require('connect');
var port = process.argv[2] || 80;
var urlParse = require('url').parse;
var http = require('http');
var agent = new http.Agent({maxSockets: 100000});

// 获取请求的 headers，去掉 host 和 connection
var getHeader = function (req) {
  var ret = {};

  for (var i in req.headers) {
    if (!/host|connection/i.test(i)) {
      ret[i] = req.headers[i];
    }
  }
  return ret;
};

// 代理请求
var proxy = function (req, res) {
  var urlParsed = urlParse(req.url, true);
  var pathname = urlParsed.pathname;
  var regUri = /^\/cgi|^\/json\/|^\/data\//i;

  if (pathname.match(regUri)) {
    var opts = {
      // 测试环境
      // host: '192.168.200.83',
      // port: '9090',
      // 预上线
      host: '119.29.11.186',
      port: '80',
      path: req.url,
      method: req.method,
      headers: getHeader(req),
      agent: agent
    };

    console.log(' - proxy ' + req.headers.host + ' to ' + opts.host + (opts.port ? ':' + opts.port : '') + req.url);

    var proxy = http.request(opts, function (response) {
      res.writeHead(response.statusCode, response.headers);
      response.pipe(res, {end: true});
    });

    req.pipe(proxy, {end: true});

    proxy.on('error', function (err) {
      res.end(err.stack);
    });
  }
};

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static('dist'))
  // .use(proxy)
  .use('/', connect.static('dist'))
  .use('/dist', connect.static('dist'))
.listen(port);

console.log('Listening on port:' + port);

//var spawn = require('child_process').spawn;
//
////var watch = spawn('grunt.cmd', ['build', 'watch']); //for windows
//var watch = spawn('grunt', ['build', 'watch']); //for mac etc.
//
//watch.stdout.on('data', function(data) {
//    console.log(data.toString());
//});
//
//watch.stderr.on('data', function(data) {
//    console.error(data.toString());
//});
//
//watch.on('exit', function (code) {
//  console.log('child process exited with code ' + code);
//});
