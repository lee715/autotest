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
			var failedtxt = dataObj['layout_tests_failed'].replace(/\/storage\/emulated\/0\/webkit\/layout_tests/g, '');
			var crashtxt = dataObj['layout_tests_crashed'].replace(/\/storage\/emulated\/0\/webkit\/layout_tests/g, '');
			var failList = failedtxt+"\t\r\n"+crashtxt;
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