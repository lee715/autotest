var http = require('http');
var fs = require('fs');
var log = require('./log.js');
var _ = require('./libs/underscore.js');

var fileCache = {
	base: 'public/apks/',
	init: function(){

	},
	_cache: {},
	url2name: function(url){
		var match = url.match(/\d+\.apk$/);
		return match?match[0]: match;
	},
	isCached: function(url){
		var name = this.url2name(url);
		if(name){
			name = name.split('.')[0];
			return this._cache[name];
		}else{
			return false;
		}
	},
	getNewest: function(){
		// var keys = _.keys(this._cache)
	},
	get: function(url, callback){
		var cached = this.isCached(url);
		if(cached){
			return callback(cached);
		}else{
			return this._get(url, callback);
		}
	},
	_get: function(url, callback){
		var name = this.url2name(url);
		console.log('url2name:'+name);
		var self = this;
		var notCache = false;
		if(!name){
			name = 'unknowned.apk';
			notCache = true; 
		}
		var cb = function(name, path){
			var info = {
				name: name,
				path: path
			};
			if(!notCache) self._cache[name.split('.')[0]] = info;
			callback(info);
		}
		this.fetchAndStoreFile(url, name, 3, cb);
	},
	fetchAndStoreFile: function(url, name, restartWhenError, callback){
		var apk = fs.createWriteStream(this.base+name);
		var self = this;
		var hasErr = false;
		restartWhenError = restartWhenError || 0;
		http.get(url, function(res){
			try{
				res.pipe(apk);
			}catch(e){
				hasErr = true;
				if(restartWhenError){
					self.fetchAndStoreFile(url, name, --restartWhenError);
				}else{
					log(e);
				}
				return false;
			}
			res.on('end', function(){
				if(!hasErr) callback(name, self.base+name);
			})
		});
	}
}

module.exports = fileCache;