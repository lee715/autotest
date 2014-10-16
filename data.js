// base root
var root = 'layout-test-results';
// use for clearing the . and / at the beginning and the end of the string
var clearReg = /^[\.\/][\.\/]*|[\.\/]*[\.\/]$/g;
// Result Model
var Result = require('./models/index.js').Result;
var fs = require('fs');

var clear = function(dir){
	return dir.replace(clearReg, '');
};
			
// read folders and store the data of file by the name of file
var store = function(callback, url){
	console.log('store start with:'+url);
	var data = {},
		url = url || './layout-test-results',
		count = 0;

	var readDirAndStore = function(dir){
		console.log('readDirAndStore:'+dir);
		count++;
		fs.readdir(dir, function(err, files){
			if(err) return;
			for(var i=0,l=files.length;i<l;i++){
				if(/\.[a-zA-Z]+$/.test(files[i])){
					var txt = fs.readFileSync(dir+'/'+files[i], 'utf8');
					var formatDir = (dir+'/'+files[i]).replace(url, '');
					storeByDir(formatDir, txt);
				}else{
					readDirAndStore(dir+'/'+files[i]);
				}
			}
			if(!--count){
				console.log('store end with:'+url);
				callback(null, data);
			}
		});
	};

	var storeByDir = function(dir, txt){
		console.log('storeByDir:'+dir);
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

// get the data stored by store function by id and dir
var getByDir = function(id, dir, callback){
	var domains = clear(dir).split('/');
	Result.find({_id: id}, function(err, r){
		if(err) return;
		r = r[0];
		if(r && r.json){
			var obj = JSON.parse(r.json);
			callback(null, getDataByDomains(obj, domains));
		}
	});
}

// get helper
var getDataByDomains = function(obj, domains){
	var domain, res = obj;
	while(domain = domains.shift()){
		if(res[domain] != undefined){
			res = res[domain];
		}else{
			var keys = [];
			for(var va in res){
				keys.push(va);
			}
			return 'getByDir err: '+domain+' is not defined<br>'+keys.join(',');
		}
	}
	return res;
}

module.exports = {
	getByDir: getByDir,
	store: store
}