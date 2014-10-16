var base = './Layout_TestCase',
	fs = require('fs'),
	Data = {},

	readdir = function(dir){
		fs.readdir(dir, function(err, files){
			if(err) return;
			Data[dir] = files;
			console.log(dir, files.length);
			for(var i=0,l=files.length;i<l;i++){
				if(/\.[a-zA-Z]+$/.test(files[i])) continue;
				readdir(dir+'/'+files[i]);
			}
		});
	};

module.exports = {
	refresh: function(){ readdir(base) },
	read: function(){return Data}
}