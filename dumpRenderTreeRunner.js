var fs = require('fs');
var _ = require('./libs/underscore.js');
var exec = require('child_process').exec;
var config = require('./config.js');
var finder = require('./finder.js');
var Info = require('./info.js');

var base = '/home/baina/github/autotest/layout-test-results';
var timeout = 10*1000;


var cmd = "adb shell am instrument -e class com.android.dumprendertree.LayoutTestsAutoTest#startLayoutTests -e path '/' -e timeout "+timeout+' -w com.android.dumprendertree/.LayoutTestsAutoRunner';

var _run = function(module, cb){
	// collect run list
	collectList(module, function(err, list){
		if(err) console.log(err);
		// clear old results
		doRm();
		exec('adb shell rm -r /sdcard/webkit/layout_tests_results', function(err){
			// run apk
			console.log('run start');
			Info.total(list.length);
			runBy100(list, cb);
			// exec(cmd, function(){
			// 	console.log('done');
			// 	doPull(function(err){
			// 		cb();
			// 	})
			// });
		})
	})
}

var run = function(module, cb){
	_run(module, function(sucTxt, failTxt, crashTxt, nontextTxt){
		console.log('runBy100 done');
		doPull(function(err){
			console.log('start write passed,failed,crashed txts');
			fs.writeFileSync(base+'/layout_tests_passed.txt', sucTxt);
			fs.writeFileSync(base+'/layout_tests_failed.txt', failTxt);
			fs.writeFileSync(base+'/layout_tests_crashed.txt', crashTxt);
			fs.writeFileSync(base+'/layout_tests_nontext.txt', nontextTxt);
			cb();
		})
	})
}

var checkNum = 2; 
var sTxt = '';
var check = function(module, cb, num){
	if(num){
		checkNum = num;
		sTxt = '';
	} 
	console.log('check start');
	if(!~module.indexOf('storage/emulated')){
		var arr = module.split(/\s+/g);
		_.each(arr, function(item,ind){
			arr[ind] = config.base_url+item;
		})
		module = arr.join("\t\r\n");
	}
	_run(module, function(sucTxt, failTxt, crashTxt, nontextTxt){
		console.log('runBy100 done');
		var fails = failTxt + "\t\r\n" + crashTxt + "\t\r\n" + nontextTxt;
		var arr = _.compact(fails.split(/\s+/g));
		fails = arr.join("\t\r\n");
		if(sucTxt.replace(/\s+/g, '').length){
			sTxt += sucTxt
		}
		if(arr.length && --checkNum){
			check(fails, cb);
		}
		if(!checkNum || !arr.length){
			cb(sTxt);
		}
	})
}

var urlPc2Mobile = function(url){
	return url.replace(new RegExp(config.base_url, 'g'), '/storage/emulated/0/webkit/layout_tests');
}

var runBy100 = function(list, cb){
	var sucCache = [];
	var failCache = [];
	var crashCache = [];
	var nontextCache = [];
	var runNum = 100;
	var arr100 = [];

	var done = function(){
		var sucTxt = sucCache.join("\t\r\n");
		var failTxt = failCache.join("\t\r\n");
		var crashTxt = crashCache.join("\t\r\n");
		var nontextTxt = nontextCache.join("\t\r\n");
		cb(sucTxt, failTxt, crashTxt, nontextTxt);
	}
	var doOne = function(){
		console.log('len:'+list.length);
		if(!list.length) return done();
		arr100 = list.splice(0,100);
		runNum = arr100.length;
		writeList(arr100, function(err){
			exec(cmd, function(err){
				if(err) console.log('run cmd err:'+err);
				console.log('done');
				collectResults(function(err){
					setTimeout(function(){
						doOne();
					},2000);
				})
			});
		})
	}
	var collectResults = function(cb){
		console.log('start collectResults');
		var count = 0;
		var total = 0;
		var done = function(){
			count++;
			if(count >= 4){
				console.log('total:'+total);
				console.log('runNum:'+runNum);
				Info.done(total);
				if(total < runNum){
					console.log('concat');
					list = list.concat(arr100.slice(total));
				}
				total = 0;
				cb(null);
			}
		}
		exec('adb shell cat /sdcard/layout_tests_passed.txt', function(err, txt){
			if(err){
				console.log('cat pass err:'+err);
			} else{
				var arr = txt.split(/\s+/g);
				console.log('passed arr:'+arr.length);
				total += arr.length-1;
				sucCache = sucCache.concat(arr);
			}
			done();
		});
		exec('adb shell cat /sdcard/layout_tests_failed.txt', function(err, txt){
			if(err){
				console.log('cat fail err:'+err);
			} else{
				var arr = txt.split(/\s+/g);
				console.log('failed arr:'+arr.length);
				total += arr.length-1;
				failCache = failCache.concat(arr);
			}
			done();
		});
		exec('adb shell cat /sdcard/layout_tests_nontext.txt', function(err, txt){
			if(err){
				console.log('cat nontext err:'+err);
			} else{
				var arr = txt.split(/\s+/g);
				console.log('nontext arr:'+arr.length);
				total += arr.length-1;
				nontextCache = nontextCache.concat(arr);
			}
			done();
		});
		exec('adb shell cat /sdcard/webkit/running_test.txt', function(err, txt){
			if(err){
				console.log('cat crash err:'+err);
			} else{
				console.log('crash:'+txt);
				if(txt != '#DONE'){
					var arr = txt.split(/\s+/g);
					console.log('crashed arr:'+arr.length);
					total += arr.length;
					crashCache = crashCache.concat(arr);
				}
			}
			done();
		});
	}
	doOne();
}

var doRm = function(){
	exec('adb shell rm /sdcard/layout_tests_passed.txt');
	exec('adb shell rm /sdcard/layout_tests_failed.txt');
	exec('adb shell rm /sdcard/layout_tests_ignored.txt');
	exec('adb shell rm /sdcard/layout_tests_nontext.txt');
}

var doPull = function(cb){
	// pull results to pc
	exec('adb pull /sdcard/webkit/layout_tests_results '+base, function(err){
		if(err) 
			console.log('do pull err:'+err)
		else
			console.log('pull done');
		cb(err);
	})
}

var writeList = function(list, cb){
	list = list.join("\t\r\n").replace(new RegExp(config.base_url, 'g'), '/storage/emulated/0/webkit/layout_tests');
	fs.writeFile('list.txt', list, function(err){
		if(err){
			console.log('write file error:'+err);
		}else{
			console.log('write file ok!');
			exec('adb push list.txt /sdcard/webkit/layout_tests_list.txt', function(err){
				if(err) console.log('push list err:'+err);
				cb(err);
			});
		}
	});
}

var collectList = function(module, cb, times){
	console.log('collect list');
	var dir = config.base_url+'/'+module;
	var list = '';
	
	if(!~module.indexOf('.')){
		// list = module.replace(/\/storage\/emulated\/0\/webkit\/layout_tests/g);
		finder.readDirAll(dir, function(dirs){
			// var list = dirs.join('\t\n');
			// writeList(list);
			cb(null, dirs);
		});
	}else{
		// writeList(dir);
		cb(null, module.split(/\s+/g));
	}
}

module.exports = {
	collectList: collectList,
	run: run,
	check: check
}