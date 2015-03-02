var express = require('express');
var fs = require('fs');
var path = require('path');
var https = require('https');
var _ = require('./libs/underscore.js');
//var busboy = require('connect-busboy');
var cookieParser = require('cookie-parser');
var exec = require('child_process').exec;
var qCtrl = require('./queue.js');
var Cache = require('./fileCache.js');
var Todo = require('./todo.js');
var Data = require('./data.js');
var Info = require('./info.js');
//var session = require('cookie-session');
var session = require('express-session');
//var bodyParser = require('body-parser');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var app = express();

app.engine('jade', require('jade').__express);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/Layout_TestCase'));

var Models = require('./models/index.js'),
	Result = Models.Result,
	TodoModel = Models.Todo;

app.post('/create',multipartMiddleware, function(req, res){
	var plan = {};
	plan.version = req.body.version;
	plan.desc = req.body.desc;
	var times = req.body.times || 1;
	var url = req.body.url;
	plan.module = req.body.layout_module;
	var fstream, path;
	var file = req.files.apk_file;
	if(!file.size && url){
		Cache.get(url, function(file){
			plan.path = file.path;
			plan.apkname = file.name;
			while(times--) qCtrl.add(plan);
			res.render('status.jade');
		});
	}else if(file.size){
		plan.path = file.path;
		plan.apkname = file.name;
		while(times--) qCtrl.add(plan);
		res.render('status.jade');
	}else{
		plan.path = '';
		plan.apkname = '';
		while(times--) qCtrl.add(plan);
		res.render('status.jade');
	}
});

// for buddy test by jenkins
app.get('/create', function(req, res){
	var type = req.param('type');
	var plan = {};
	plan.version = req.param('version');
	plan.desc = req.param('desc');
	var times = req.param('times') || 1;
	var url = req.param('url');
	plan.module = req.param('layout_module');
	if(!type){
		plan.module = plan.module.replace(/_{0,1}fast/, '_fast');
	}
	Cache.get(url, function(file){
		plan.path = file.path;
		plan.apkname = url;
		while(times--) qCtrl.add(plan);
		res.send('done');
	});
});
app.get('/getResultByApkAndModule', function(req, res){
	var apkname = req.param('url');
	var module = req.param('layout_module');
	var type = req.param('type');
	if(!type){
		module = module.replace(/_{0,1}fast/, '_fast');
	}
	Result.find({apkname: apkname, module: module}, function(err, rs){
		if(err) res.send(err);
		if(rs.length){
			var arr = [];
			arr.push('<html><head></head><body style="font-family:Helvetica Neue,Hiragino Sans GB,Microsoft Yahei,WenQuanYi Micro Hei,sans-serif">');
			_.each(rs, function(rs){
				console.log(rs._id);
				var total = rs.passed + rs.failed + rs.crashed + rs.nontext;
				arr.push('version: '+rs.version);
				arr.push('description: '+rs.desc);
				arr.push('finish time: '+rs.time);
				arr.push('apkname: '+rs.apkname);
				arr.push('module: '+rs.module);
				arr.push('');
				arr.push(total+' cases has been tested, and:');
				arr.push('passed: <span style="color:#b7d967">'+rs.passed+'</span>');
				arr.push('failed: <span style="color:#f38283">'+rs.failed+'</span>');
				arr.push('crashed: <span style="color:#fed174">'+rs.crashed+'</span>');
				arr.push('nontext: <span style="color:#a3e6f8">'+rs.nontext+'</span>');
				if(rs.failed + rs.crashed != 0){
					var dataObj = Data.getDataObj(rs._id);
					arr.push('');
					if(rs.failed){
						arr.push('failed cases:');
						var failedArr = dataObj['layout_tests_failed'].split(/\s+/g);
						_.each(failedArr, function(fone){
							if(fone.replace(/\s+/g, '') == '') return;
							var expect = fone.replace(/\.[a-zA-Z]+$/, function(ma){
								return '-expected.txt';
							});
							var result = fone.split('.')[0]+'-result';
							var oriUrl = config.base_url+expect;
							var val = Data.getByDir(rs._id, fone);
							var hasErr = false;
							var expectTxt = '';
							try{
								expectTxt = fs.readFileSync(oriUrl, 'utf8');
							}catch(e){
								hasErr = true;
								console.log('read file '+oriUrl+' failed.');
							}
							arr.push('<a target="_blank" href="http://enginetest.baina.com:5000/172.17.100.196'+fone+'">'+fone+'</a>');
							if(!~val.indexOf('getByDir err')){
								arr.push('result this time:');
								arr.push('<pre style="margin:0;border:1px solid #ccc;padding:10px;color:#666;background:#efefef;">'+val+'</pre>result expected:');
							}else{
								arr.push('result expected:');
							}
							arr.push('<pre style="margin:0;border:1px solid #ccc;padding:10px;color:#666;background:#efefef;">'+expectTxt+'</pre>')
						})
					}
					if(rs.crashed){
						arr.push('crashed cases:');
						var crashedArr = dataObj['layout_tests_crashed'].split(/\s+/g);
						_.each(crashedArr, function(cone){
							arr.push('<a href="http://enginetest.baina.com:5000/172.17.100.196'+cone+'">'+cone+'</a>');
						})
					}
				}
			})
			arr.push('</body></html>');
			var str = arr.join('<br/>');
			res.send(str);
		}else{
			res.send('undone');
		}
	})
});

app.get('/retest', function(req, res){
	var module = req.param('module');
	var version = req.param('version');
	var apkname = req.param('apkname');
	var arr = [];
	var count = 100;
	if(!~module.indexOf('storage/emulated')){
		module = config.base_url+module;
	}
	while(count--){
		arr.push(module);
	}
	var plan = {};
	plan.version = version || 'retest';
	plan.desc = 'retest';
	plan.module = arr.join("\r\t\n");
	if(apkname){
		Cache.get(apkname, function(file){
			plan.path = file.path;
			plan.apkname = apkname;
			qCtrl.add(plan);
			res.send('done');
		});
	}else{
		plan.path = '';
		plan.apkname = apkname;
		qCtrl.add(plan);
		res.send('done');
	}
});

app.get('/getQueueInfo', function(req, res){
	var info = qCtrl.info();
	res.json(info);
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
		console.log(rs.length);
		var pageNum = Math.ceil(rs.length/30);
		res.render('result.jade', {pageNum: pageNum, rs:rs});
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


app.get('/getByDir', function(req, res){
	var id = req.param('id');
	var dir = req.param('dir');
	var islist = ~'layout_tests_passed.txt layout_tests_nontext.txt layout_tests_failed.txt layout_tests_crashed.txt'.indexOf(dir);
	console.log(id, dir);
	dir = dir.split('.')[0];
	var d = Data.getByDir(id, dir);
	console.log(d.length);
	if(islist){
		res.send(d);
	}else{
		res.render('txt.jade', {txt: d}); 
	}
});
app.get('/retest', function(req, res){
	var id = req.param('id');
	var count = 2;
	var dirs = 'layout_tests_failed.txt layout_tests_crashed.txt'.split(' ');
	var list = [];
	var done = function(){
		if(!--count){
			var module = list.join("\t\r\n");
			Result.findOne({_id: id}).exec(function(err, rs){
				if(err) console.log(err);
				var plan = {};
				plan.module = module;
				plan.path = rs.plan;
				plan.desc = 'retest for '+id;
				plan.version = rs.version;
				plan.apkname = rs.apkname;
				qCtrl.add(plan);
			})
		}
	}
	_.each(dirs, function(dir){
		Data.getByDir(id, dir, function(err, d){
			d && d.length && list.push(d);
			done();
		});
	})
});
app.get('/getResultById', function(req, res){
	var id = req.param('id');
	Result.find({_id: id}).exec(function(err, rs){
		if(err) console.log(err);
		res.json(rs[0]);
	})

})
app.get('/faillist', function(req, res){
	var id = req.param('id');
	var failJson = fs.readFileSync('public/data/f'+id+'.txt', 'utf8');
	var failObj = JSON.parse(failJson);
	var failArr = _.pairs(failObj);
	res.render('faillist.jade', {faillist: failArr});
});

app.get('/todolist', function(req, res){
	var obj = { items: Todo.getItems(), data: Todo.get() };
	res.render('todolist.jade', obj);
});

app.get('/getNewTask', function(req,res){
	var owner = req.param('owner');
	Todo.getDaliyTask(owner, function(err, todos){
		res.redirect('/')
	})
});

app.get('/daliyTask', function(req, res){
	var owner = req.param('owner');
	var getnew = req.param('new');
	TodoModel.find({owner: owner, status: 'open'}).exec(function(err, todos){
		if(todos.length && !getnew){
			res.render('task.jade', {todos: todos});
		}else{
			Todo.getDaliyTask(owner, function(err, todos){
				console.log(arguments);
				if(err)
					res.send(err)
				else
					res.render('task.jade', {todos: todos})
			})
		}
	})
});

app.get('/report', function(req, res){
	res.render('report.jade');
})

app.get('/fetchDoneTask', function(req, res){
	TodoModel.find({status:'done'}, function(err, todos){
		if(err) 
			res.send(err);
		else
			res.json(todos);
	})
})

app.get('/markDone', function(req, res){
	var change = req.param('change');
	var id = req.param('id');
	console.log(id);
	TodoModel.findOne({_id: id}, function(err, todo){
		if(err){
			res.json(err);
		}else{
			todo.changes.push(change);
			todo.status = 'done';
			todo.doneTime = Date.now();
			todo.save(function(err){
				if(err){
					res.send('save err');
				}else{
					if(~change.indexOf('[delete]')){
						Todo.removeFromMobile(todo.path, function(err){
							if(err)
								res.send(err);
							else
								res.send('ok');
						})
					}else{
						Todo.pushToMobile(todo.path, function(err){
							if(err)
								res.send(err);
							else
								res.send('ok');
						});
					}
				}
			})
		}
	});
});

app.get('/deleteCase', function(req, res){
	var dir = req.param('dir');
	Todo.removeFromMobile(dir, function(err){
		if(err)
			res.send(err);
		else
			res.send('ok');
	})
});

app.get('/refreshCase', function(req, res){
	var path = req.param('path');
	var owner = req.param('owner');
	var module = path;
	// if(path.charAt(0) == '/') module = path.slice(1);
	//module = module.split('/').slice(0, -1).join('/');
	//var url = 'http://172.16.7.25:1234/media/apk/DumpRenderTree-release-signed_20150116105242.apk';
	var plan = {};
	plan.version = '[test]';
	plan.desc = '[test] '+owner;
	var times = req.param('times') || 1;
	plan.module = Todo.makeTodoModule(module);
	plan.path = '';
	plan.apkname = '';
	Todo.pushToMobile(path, function(err){
		if(err)
			res.send(err);
		else{
			while(times--) qCtrl.add(plan);
			res.send('ok');
		}
			// Cache.get(url, function(file){
			// 	plan.path = file.path;
			// 	plan.apkname = file.name;
				
			// });
	});
});

app.get('/refreshStatus', function(req, res){
	res.json(Info.get());
})

// test
app.get('/jfs', function(req, res){
	res.send(config.os);
});

app.get('/test', function(req, res){
	var j = req.param('j');
	fs.writeFile('./public/data/todo.txt', j, function(err){
		if(err)
			console.log('merge todo file error:'+err);
		else
			console.log('merge todo file ok!');
	});
});

finder.refresh();
/*** https test end ***/
var server = app.listen(5000, function() {
    console.log('Listening on port %d', server.address().port);
});

