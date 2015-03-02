var config = require('./config.js'),
	base = config.base_url,
	fs = require('fs'),
	Data = {},

	readdir = function(dir){
		fs.readdir(dir, function(err, files){
			if(err) return console.log(err);
			Data[dir] = files;
			for(var i=0,l=files.length;i<l;i++){
				if(/\.[a-zA-Z]+(-disabled){0,1}$/.test(files[i])) continue;
				readdir(dir+'/'+files[i]);
			}
		});
	},

	readDirAll = function(dir, cb){
		var res = [];
		var count = 0;
		var read = function(dir){
			count++;
			fs.readdir(dir, function(err, files){
				if(err){
					console.log(err);
				}else{
					for(var i=0,l=files.length;i<l;i++){
						if(/\.[a-zA-Z]+(-disabled){0,1}$/.test(files[i])){
							if(/\.(html|xml|xhtml)$/.test(files[i]) && !/TEMPLATE\.html$/.test(files[i])){
								res.push(dir+'/'+files[i]);
							}
						}else if(files[i] != 'resources' && files[i] != 'script-tests'){
							read(dir+'/'+files[i]);
						}
					}
				} 
				count--;
				if(count<=0) cb(res);
			});
		}
		read(dir);
	};

module.exports = {
	refresh: function(){ readdir(base) },
	read: function(){
		return Data
	},
	readDirAll: readDirAll
}