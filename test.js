var fs = require('fs');
var Todo = require('./todo.js');
var _ = require('./libs/underscore.js');
var finder = require('./finder.js');
var exec = require('child_process').exec;
var Data = require('./data.js');
var Models = require('./models/index.js');
var Result = Models.Result;
var config = require('./config.js');
var finder = require('./finder.js');

// var base = '/home/baina/github/autotest/layout-test-results';
// exec('cd Layout_TestCase;cd 172.17.100.196;rm test.txt;')
// finder.readDirAll('./Layout_TestCase/_fast', function(dirs){
// 	console.log(dirs);
// });

// var tree = require('./dumpRenderTreeRunner.js');
// tree.retest('/fast/loader/hashchange-event-async.html');
// tree.collectList('_fast', function(err, arr){
// 	console.log(arr.length);
// });

// Data.store(function(err, dataObj, failObj){
// 	if(err) return console.log(err);
// 	console.log('store data success, start writing file');
	
// 		markDone(dataObj, failObj);
// });

// Models.Todo.find({status: 'done', owner: 'yangyp'}).limit(31).exec(function(err, todos){
// 	var month1 = new Date;
// 	var count = 0;
// 	console.log(todos.length);
// 	_.each(todos, function(todo){
// 		todo.doneTime = month1;
// 		todo.save(function(){
// 			console.log(++count);
// 		});
// 	});

// })

// function markDone(dataObj, failObj){
// 	var a = new Result;
// 	a.module = 'fast';
// 	a.apkname = '20150209100818.apk';
// 	a.desc = '[layout daliy]1';
// 	a.version = 'V11.4.2';
// 	a.time = Date.now();
// 	fs.writeFile('./public/data/r'+a._id+'.txt', JSON.stringify(dataObj), function(err){
// 		if(err)
// 			console.log('write file error:'+err);
// 		else
// 			console.log('write file r'+a._id+'.txt ok!');
// 		if(failObj){
// 			fs.writeFile('./public/data/f'+a._id+'.txt', JSON.stringify(failObj), function(err){
// 				if(err)
// 					console.log('write file error:'+err);
// 				else
// 					console.log('write file f'+a._id+'.txt ok!');
// 			});
// 		}
// 	 	// jsonfsCtrl.str2jsonfs( JSON.stringify(data), a._id );
// 		a.save(function(err){
// 			if(err) 
// 				console.log(err);
// 			else
// 				console.log('save result success');
// 		});
// 		// Data.clearResults();
// 	});
// 	// fs.writeFile('./public/log.txt', addtionlog, function(err){
// 	// 	if(err)
// 	// 		console.log('write log error:'+err);
// 	// 	else
// 	// 		console.log('write log.txt ok!');
// 	// });
	
// };

// console.log('collect list');
// var dir = config.base_url+'/_fast';
// var list = '';

// // list = module.replace(/\/storage\/emulated\/0\/webkit\/layout_tests/g);
// finder.readDirAll(dir, function(dirs){
// 	// var list = dirs.join('\t\n');
// 	// writeList(list);
// 	console.log('read done ,len is '+dirs.length);
// 	var txt = dirs.join("\t\r\n").replace(new RegExp(dir, "g"), 'fast');
// 	fs.writeFileSync("./suclist.txt", txt, 'utf8');
// });

// exec('adb shell cat /sdcard/webkit/layout_tests_list.txt', function(){
// 	console.log(arguments);
// })

// var Models = require('./models/index.js'),
// 	TodoModel = Models.Todo,
// 	Result = Models.Result;

// var c = 0;

// // TodoModel.count({}, function(err, count){
// // 	console.log(count);
// // })

// // TodoModel.find({}).limit(20).exec(function(err, todos){
// // 	console.log(err);
// // 	console.log(todos && todos.length);
// // 	// for(var i=0,l=todos.length;i<l;i++){
// // 	// 	todos[i].owner = '0';
// // 	// 	todos[i].save(function(){
// // 	// 		console.log(++c);
// // 	// 	});
// // 	// }
// // });

// // var ts = ['f54af6b07eff28a0d68f209f4.txt', 'f54af81d5eff28a0d68f209f5.txt', 'f54af990deff28a0d68f209f6.txt', 'f54afaff8eff28a0d68f209f7.txt'];
// // var objs = [{}];
// // _.each(ts, function(t){
// // 	var jstr = fs.readFileSync('./public/data/'+t);
// // 	objs.push(JSON.parse(jstr));
// // });
// // var todo = _.extend.apply(_, objs);
// // var tdStr = JSON.stringify(todo);
// // fs.writeFile('./public/data/todo.txt', tdStr, function(err){
// // 	if(err)
// // 		console.log('merge todo file error:'+err);
// // 	else
// // 		console.log('merge todo file ok!');
// // });

// // Todo.toDB();


// var ids = ["54afaff8eff28a0d68f209f7","54af990deff28a0d68f209f6","54af6b07eff28a0d68f209f4","54af81d5eff28a0d68f209f5"];
// var ids = "54bcb41c287819dd0a8aaaec,54bcb0fb287819dd0a8aaaeb,54bcade2287819dd0a8aaaea,54bcaabd287819dd0a8aaae9,54bca794287819dd0a8aaae8,54bca46b287819dd0a8aaae7,54bca145287819dd0a8aaae6,54bc9f2d287819dd0a8aaae5,54bc9c06287819dd0a8aaae4,54bc98da287819dd0a8aaae3,54bc95b3287819dd0a8aaae2,54bc9280287819dd0a8aaae1,54bc8f59287819dd0a8aaae0,54bc8c34287819dd0a8aaadf,54bc8911287819dd0a8aaade,54bc85fe287819dd0a8aaadd,54bc82c8287819dd0a8aaadc,54bc7fa4287819dd0a8aaadb,54b8d215d30ca7e91e07d2b0,54b8ceddd30ca7e91e07d2af,54b8cb91d30ca7e91e07d2ae,54b8c631d30ca7e91e07d2ad,54b8c04ad30ca7e91e07d2ac".split(',');

// var read = function(id){
// 	var txt = fs.readFileSync('./public/data/r'+id+'.txt');
// 	return JSON.parse(txt)['layout_tests_failed'].replace(/\/storage\/emulated\/0\/webkit\/layout_tests\//g, '');
// 	// return JSON.parse(txt)['layout_tests_passed'].replace(/\/storage\/emulated\/0\/webkit\/layout_tests\//g, '');
// }

// var isIn = function(arrs, item){
// 	var res = true;
// 	_.each(arrs, function(d){
// 		var chs = arrs.join(',');
// 		res = res && ~chs.indexOf(item);
// 	})
// 	return res;
// }

// var merge = function(arr, checklist){
// 	var res = [];
// 	_.each(arr, function(a){
// 		if(isIn(checklist, a)){
// 			res.push(a);
// 		}
// 	});
// 	return res;
// }

// var arr = [];
// _.each(ids, function(id){
// 	var failed = read(id);
// 	var failArr = failed.split(/\s+/g);
// 	arr = arr.concat(failArr);
// });
// // _.each(ids, function(id){
// // 	var failed = read(id);
// // 	var failArr = failed.split(/\s+/g);
// // 	arr.push(failArr);
// // });

// // var result = merge(arr[0], arr.slice(1));
// // var count = 0;
// // var last = '';

// var queue = arr;
// var count = 0;
// var isrunning = false;
// var run = function(){
// 	if(isrunning) return;
// 	isrunning = true;
// 	var item = queue.shift();
// 	console.log('/sdcard/webkit/layout_tests/'+item);
// 	exec('adb shell rm /sdcard/webkit/layout_tests/'+item, function(err){
// 		if(err) 
// 			console.log(err);
// 		else
// 			console.log(++count);
// 		isrunning = false;
// 		run();
// 	});
// }
// run();

// console.log(result.length);
// var doOne = function(){
// 	if(!result.length) return console.log('done');
// 	var item = result.pop().slice(1);
// 	var origprefix = '/sdcard/webkit/layout_tests/';
// 	var mobiprefix = '/sdcard/webkit/layout_tests/_';
// 	var expect = item.replace(/\.[a-zA-Z]+$/, '-expected.txt');
// 	try{
// 		console.log('adb shell cp '+origprefix+expect+' '+mobiprefix+expect);
// 		exec('adb shell cp '+origprefix+item+' '+mobiprefix+item, function(e){
// 			if(e) console.log(e);
// 			exec('adb shell cp '+origprefix+expect+' '+mobiprefix+expect, function(){
// 				doOne();
// 			});
// 		});
// 	}catch(e){
// 		console.log(e);
// 	}
// }
// doOne();
// _.each(result, function(item){
// 	if(item == '') return true;
// 	var origprefix = './Layout_TestCase/';
// 	var mobiprefix = '/sdcard/webkit/layout_tests/';
// 	var dir = item.split("/").slice(0, -1).join("/");
// 	if(dir == last)
// 		return true;
// 	else
// 		last = dir;
// 	console.log('adb shell mkdir -p '+mobiprefix+dir);
// 	try{
// 		exec('adb shell mkdir -p '+mobiprefix+dir);
// 	}catch(e){
// 		console.log(e);
// 	}
// })

// var readdir = function(dir){
// 	var err = null;
// 	try{
// 		var files = fs.readdirSync(dir);
// 	}catch(e){
// 		err = e;
// 		console.log(e);
// 	}
// 	if(err) return [];
// 	var rarr = [];
// 	_.each(files, function(f, i){
// 		if(!/\.[a-zA-Z0-9-]+$/.test(f)){
// 			rarr.push( readdir(dir+'/'+f) );
// 		}else{
// 			rarr.push( dir+'/'+f );
// 		}
// 	});
// 	var res = [].concat.apply([], rarr);
// 	return res;
// }
// var files = readdir('/home/baina/github/autotest/Layout_TestCase/fast');

// console.log(files.length);
// var queue = [];
// var rmlist = [];
// var count = 0;
// var isrunning = false;
// var run = function(){
// 	if(isrunning) return;
// 	isrunning = true;
// 	var file = queue.shift();
// 	var exp = file.replace(/\.[a-zA-Z]+$/, '-expected.txt');
// 	exec('rm '+file, function(e){
// 		e && console.log(e);
// 		exec('rm '+exp, function(e){
// 			isrunning = false;
// 			run();
// 		})
// 	})
// }

// _.each(files, function(file){
// 	var txt = fs.readFileSync(file, 'utf8');
// 	if(~txt.indexOf('internals')){
// 		console.log(++count);
// 		console.log(file);
// 		queue.push(file);
// 		run();
// 		rmlist.push(file);
// 	}
// })

// fs.writeFile('./rm.txt', rmlist.join(','), function(err){
// 	if(err)
// 		console.log('add rm file err:'+err);
// 	else
// 		console.log('add rm file suc!');
// });
// var list = fs.readFileSync('./rm.txt', 'utf8');
// console.log(list.split(',').length);

//script for copy resources
// var dirs = fs.readdirSync('./Layout_TestCase/fast');
// var queue = [];
// var isrunning = false;
// var count= 0;
// var run = function(){
// 	if(isrunning || !queue.length) return;
// 	console.log('statrt'+ ++count);
// 	isrunning = true;
// 	dir = queue.shift();
// 	exec('adb shell cp -r /sdcard/webkit/layout_tests/fast/'+dir+'/script-tests /sdcard/webkit/layout_tests/_fast/'+dir+'/', function(err){
// 		console.log(err)
// 		exec('adb shell cp -r /sdcard/webkit/layout_tests/fast/'+dir+'/resources /sdcard/webkit/layout_tests/_fast/'+dir+'/', function(err){
// 			isrunning = false;
// 			console.log('end'+count);
// 			run();
// 		})
// 	})
// }

// _.each(dirs, function(dir){
// 	queue.push(dir);
// 	run();
// })
