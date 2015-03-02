// base root
var root = 'layout-test-results';
// use for clearing the . and / at the beginning and the end of the string
var clearReg = /^[\.\/][\.\/]*|[\.\/]*[\.\/]$/g;
// Result Model
var models = require('./models/index.js');
var Result = models.Result;
var jsonfsCtrl = require('./jsonfs.js');
var config = require('./config.js');
var fs = require('fs');
var _ = require('./libs/underscore.js');

var clear = function(dir){
	return dir.replace(clearReg, '');
};

var clearSpace = function(str){
	return str.replace(/\s+/g, '')
}

var expectedEquarl = function(str1, str2){
	return clearSpace(str1) === clearSpace(str2);
}
			
// read folders and store the data of file by the name of file
var store = function(callback, url){
	var data = {},
		url = url || './layout-test-results',
		count = 0;

	var readDirAndStore = function(dir){
		// console.log('readDirAndStore:'+dir);
		count++;
		fs.readdir(dir, function(err, files){
			if(err){
				console.log(err);
			}else{
				for(var i=0,l=files.length;i<l;i++){
					if(/\.[a-zA-Z]+$/.test(files[i])){
						var txt = fs
							.readFileSync(dir+'/'+files[i], 'utf8')
							.replace(/\/storage\/emulated\/0\/webkit\/layout_tests/g, '');
						var formatDir = (dir+'/'+files[i]).replace(url, '');
						storeByDir(formatDir, txt);
						txt = '';
					}else{
						readDirAndStore(dir+'/'+files[i]);
					}
				}
			}
			count--;
			if(!count){
				storeDone();
			}
		});
	};

	var storeDone = function(){
		console.log('store end with:'+url);
		// format and store failed ones
		var dataObj = data;
		if(dataObj['layout_tests_failed']){
			// var failObj = {};
			var failedtxt = dataObj['layout_tests_failed'].replace(/\/storage\/emulated\/0\/webkit\/layout_tests/g, '');
			var crashtxt = dataObj['layout_tests_crashed'].replace(/\/storage\/emulated\/0\/webkit\/layout_tests/g, '');
			var failList = failedtxt+"\t\r\n"+crashtxt;
			// var failedArr = failedtxt.split(/\s+/g);
			// var crashArr = crashtxt.length?crashtxt.split(/\s+/g):[];
			// var arr = failedArr.concat(crashArr);
			// delete failedtxt;
			// delete crashtxt;
			// delete failedArr;
			// delete crashArr;
			// console.log(arr.length+' failed');
			// _.each(arr, function(item,ind){
			// 	console.log(ind);
			// 	if(item == '') return true;
			// 	var expect = item.replace(/\.[a-zA-Z]+$/, function(ma){
			// 		return '-expected.txt';
			// 	});
				// var result = item.split('.')[0]+'-result';
				// var oriUrl = config.base_url+expect;
				// var domains = clear(result).split('/');
				// var val = getDataByDomains(dataObj, domains);
				// var hasErr = false;
				// var expectTxt = '';
				// try{
				// 	expectTxt = fs.readFileSync(oriUrl, 'utf8');
				// }catch(e){
				// 	hasErr = true;
				// 	console.log('read file '+oriUrl+' failed.');
				// }
			// 	// if no error occurred and the result is not expected, store the result
			// 	// !/Uncaught\s+TypeError|getByDir\s+err/.test(val) && 
			// 	// if(!hasErr && !expectedEquarl(val, expectTxt)){
			// 	// 	console.log('fail matched');
			// 	// 	failObj[item] = [val, expectTxt];
			// 	// }
			// 	val = val.slice(0, expectTxt.length+100);
			// 	failObj[item] = [val, expectTxt];
			// });
		}
		callback(null, dataObj, failList);
	};

	var storeByDir = function(dir, txt){
		// console.log('storeByDir:'+dir);
		var domains = clear(dir).split('/'),
			file = domains.pop(), domain, _data = data;
		while(domain = domains.shift()){
			if(!_data[domain])
				_data[domain] = {};
			_data = _data[domain];
		}
		_data[ file.split('.')[0] ] = txt;
	};

	readDirAndStore(url);
};

var getDataObj = function(id){
	var dataJson = fs.readFileSync('public/data/r'+id+'.txt', 'utf8');
	return JSON.parse(dataJson);
};

// get the data stored by store function by id and dir
var getByDir = function(id, dir){
	var domains = clear(dir).split('/');
	dataObj = getDataObj(id);
	return getDataByDomains(dataObj, domains);
	// Result.find({_id: id}, function(err, r){
	// 	if(err) return;
	// 	r = r[0];
	// 	jsonfsCtrl.jsonfs2str(r._id, function(err, str){
	// 		if(err) console.log('jsonfs2str err:'+err);
	// 		console.log('callback:'+str);
	// 		var obj = JSON.parse(str);
	// 		callback(null, getDataByDomains(obj, domains));
	// 	});
	// });
}

// get helper
var getDataByDomains = function(obj, domains){
	// console.log('domains:'+domains);
	var domain, res = obj;
	while(domain = domains.shift()){
		if(res[domain] != undefined){
			res = res[domain];
		}else{
			var keys = [];
			for(var va in res){
				keys.push(va);
			}
			return 'getByDir err: '+domain+' is not defined';
		}
	}
	return res;
}

var file2DB = function(plan){
	var order = ['nontext','crashed','failed','passed'], item, txt, len;
	var a = new Result;
	while(item = order.pop()){
		txt = fs.readFileSync('./layout-test-results/layout_tests_'+item+'.txt', 'utf8') 
			.replace(/[\n|\s]+/g, ',')
			.replace(/^,|,$/g, '') 
		if(txt == ''){
			len = 0;
		}else{
			len = txt.split(',').length;
		}
		a[item] = len;
	}
	a.desc = plan.desc;
	a.version = plan.version;
	a.module = plan.module;
	a.apkname = plan.apkname;
	return a;
}

var clearResults = function(){
	var line;
	if(config.os == 'ubuntu'){
		line = 'rm -r layout-test-results';
	}else{
		line = 'rmdir /s/q layout-test-results';
	}
	command(line, function(err){
		if(err)
			console.log('remove results files in '+config.os+' failed:'+err);
		else
			console.log('remove files success');
	});
}

module.exports = {
	getByDir: getByDir,
	store: store,
	file2DB: file2DB,
	clearResults: clearResults,
	getDataObj: getDataObj,
	getDataByDomains: getDataByDomains
}