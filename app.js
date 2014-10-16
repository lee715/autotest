var express = require('express');
var fs = require('fs');
var path = require('path');
var https = require('https');
//var busboy = require('connect-busboy');
var cookieParser = require('cookie-parser');
var exec = require('child_process').exec;
var qCtrl = require('./queue.js');
//var session = require('cookie-session');
var session = require('express-session');
//var bodyParser = require('body-parser');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var app = express();

app.engine('jade', require('jade').__express);

app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'keyboard cat'}));

var Models = require('./models/index.js'),
	Result = Models.Result;

app.post('/create',multipartMiddleware, function(req, res){
	var plan = {};
	plan.version = req.body.version;
	plan.desc = req.body.desc;
	var times = req.body.times || 1;
	plan.module = req.body.layout_module;
	var fstream, path;
	var file = req.files.apk_file;
	if(file){
		console.log(file);
		plan.path = file.path;
		plan.apkname = file.name;
		while(times--) qCtrl.add(plan);
		res.render('redir.jade');
	}
});

var finder = require('./finder.js');
app.get('/refresh', function(req,res){
	finder.refresh();
	res.send('ok');
});
app.get('/read', function(req, res){
	var data = finder.read();
	res.json(data);
});

app.get('/', function(req, res){
	res.render('create.jade');
});

app.get('/index', function(req, res){
	res.render('create.jade');
});

app.get('/result', function(req, res){

	Result.find({}, function(err, rs){
		if(err) throw err;
		var pageNum = Math.ceil(rs.length/30);
		res.render('result.jade', {pageNum: pageNum});
	});
});

app.get('/fetchByPage', function(req, res){
	var page = req.param('page') || 1;

	Result.find({}).sort({'_id':-1}).exec(function(err, rs){
		if(err) throw err;
		var pageNum = Math.ceil(rs.length/30);
		if(page <=0) page = 1;
		if(page >pageNum) page = pageNum;
		rs = rs.slice(30*(page-1), 30*page);
		res.json({data: rs, page: page});
	});
});

app.get('/diff', function(req, res){
	res.render('diff.jade');
});

var Data = require('./data.js');
app.get('/getByDir', function(req, res){
	var id = req.param('id');
	var dir = req.param('dir');
	console.log(id, dir);
	dir = dir.split('.')[0];
	Data.getByDir(id, dir, function(err, d){
		res.send(d);
	})
});

// test
app.get('/testStoreRes', function(req, res){
	qCtrl.store(function(err, data){
		res.send(data);
	})
});

app.get('/test', function(req, res){
	res.render('test.jade');
});

finder.refresh();
/*** https test end ***/
var server = app.listen(5000, function() {
    console.log('Listening on port %d', server.address().port);
});

