/*
  queue.js is a controller for managing tasks.
*/
var exec = require('child_process').exec,
	fs = require('fs'),
	iconv = require('iconv-lite')
	Data = require('./data.js'),
	config = require('./config.js'),
	Todo = require('./todo.js'),
	Info = require('./info.js'),
	_ = require('./libs/underscore.js'),
	DumpRenderTree = require('./dumpRenderTreeRunner.js'),

	Models = require('./models/index.js'),
	Result = Models.Result,
	jsonfsCtrl = require('./jsonfs.js'),
	q = [],
	errlist = [],

	running = false,

	// addtion related var
	addtionQueue = [],
	addtionCheckList = {},
	addtionSuc = [],

	// add task to the queue.
	add = function(plan){
		console.log('add check');
		console.log(plan);
		if(!plan.module) return false;
		console.log('add start');
		q.push(plan);
		if(!running) run();
	},

	// check if the device is free
	checkDevice = function(cb){
		console.log('check device');
		command('adb devices', function(err, info){
			if(err)
				cb(false);
			else
				cb(true);
		})
	},

	checkToRun = function(){
		console.log('run check');
		if(running || q.length == 0){
			return false;
		}else{
			console.log('run start');
			markRunning();
			return true;
		}
	},

	markRunning = function(){
		running = true;
	},

	markFree = function(){
		running = false;
	},

	installApk = function(plan, cb){
		console.log('install apk');
		// 安装测试包 
		if(!plan.apkname && !plan.path){
			cb(true);
		}else{
			var path = !plan.path?'./public/apks/'+plan.apkname: plan.path;
			command('adb install -r '+path, function(err){
				if(err)
					cb(false);
				else
					cb(true);
			})
		}
		
	},

	getDirStr = function(url){
		return url.split('/').slice(0, -1).join('/');
	},


	addtionlog = '',

	log = function(str){
		addtionlog += str+"\n\n";
	},

	startAddtionTest = function(failList, cb){
		console.log('startAddtionTest');
		// var fails = _.keys(failObj).join("\r\t\n");
		DumpRenderTree.check(failList, function(sucTxt){
			console.log('check done, sucTxt is :'+sucTxt);
			cb(sucTxt?sucTxt.split(/\s+/g):null);
		}, 5);
	},

	addtionMarkPass = function(sucArr, dataObj, failList, model){
		console.log('addtionMarkPass');
		console.log(sucArr);
		_.each(sucArr, function(item){
			item = item.replace(/\/storage\/emulated\/0\/webkit\/layout_tests/g, '');
			console.log('item:'+item);
			if(item.replace(/\s+/g, '').length){
				// console.log(failObj[item] && failObj[item].slice(0,100));
				// delete failObj[item];
				if(~dataObj['layout_tests_failed'].indexOf(item)){
					console.log('fixed one failed item');
					model.passed++;
					model.failed--;
					dataObj['layout_tests_failed'] = dataObj['layout_tests_failed'].replace(new RegExp(item+"\\s*"), '');
				}else if(~dataObj['layout_tests_crashed'].indexOf(item)){
					console.log('fixed one crashed item');
					model.passed++;
					model.crashed--;
					dataObj['layout_tests_crashed'] = dataObj['layout_tests_crashed'].replace(new RegExp(item+"\\s*"), '');
				}
			}
		});
	},

	markDone = function(dataObj, failList, a){
		Info.status('filewriting');
		fs.writeFile('./public/data/r'+a._id+'.txt', JSON.stringify(dataObj), function(err){
			if(err)
				console.log('write file error:'+err);
			else
				console.log('write file r'+a._id+'.txt ok!');
			// if(failList){
			// 	fs.writeFile('./public/data/f'+a._id+'.txt', JSON.stringify(failObj), function(err){
			// 		if(err)
			// 			console.log('write file error:'+err);
			// 		else
			// 			console.log('write file f'+a._id+'.txt ok!');
			// 	});
			// }
			// Todo.merge(failObj);
			
		 	// jsonfsCtrl.str2jsonfs( JSON.stringify(data), a._id );
			Info.status('sqlsaving');
			a.save(function(err){
				if(err) 
					console.log(err);
				else
					console.log('save result success');
			});
			Data.clearResults();
			running = false;
			Info.init();
			run();
		});
	},

	run = function(){
		if(checkToRun()){
			checkDevice(function(hasDevice){
				if(hasDevice){
					var plan = q.shift();
					installApk(plan, function(installed){
						if(!installed){
							console.log('install err');
							errlist.push(plan);
							markFree();
							run();
						}else{
							console.log('start apk');
							Info.init(_.extend({q: q.length}, plan));
							Info.status('testing');
							// var line = 'python run_layout_tests.py --refresh-test-list '+plan.module;
							// 指示手机开始测试
							// command(line, function(err, stdout, stderr){
							DumpRenderTree.run(plan.module, function(err){
								if(err){
									console.log("err:"+err);
									return;
								}
								console.log('run apk success, start storing data');
								var a = Data.file2DB(plan);
								console.log('total:'+a.total+';passed:'+a.passed+';failed:'+a.failed+';crashed:'+a.crashed);
								Info.status('storing');
								Data.store(function(err, dataObj, failList){
									if(err) return console.log(err);
									console.log('store data success, start writing file');
									if(failList && ~a.module.indexOf('_fast')){
										Info.status('checking');
										startAddtionTest(failList, function(sucArr){
											console.log('sucArr:');
											console.log(sucArr);
											sucArr && addtionMarkPass(sucArr, dataObj, failList, a);
											markDone(dataObj, failList, a);
										});
									}else{
										markDone(dataObj, failList, a);
									}
								});
							});
						}
					}) 
				}
			})
		}
	},

	command = function(line, cb){
		exec(line, cb);
	};


module.exports = {
	add: add,
	info: function(){
		var time = 0;
		for(var i=0, l=q.length;i<l;i++){
			if(q[i].module == 'fast'){
				time += 2;
			}else{
				time += 0.5;
			}
		}
		var res = {
			len: q.length,
			time: time,
			running: running
		}
		return res;
	}
}