var JsonfsModel = require('./models/index.js').Jsonfs;

var str2jsonfs = function(str, id){
	var pice = 8 * 1024,
		len = str.length,
		c = Math.ceil(len/pice);
	console.log('pieces:'+c+';id:'+id);
	for(var i=0;i<c;i++){
		var jf = new JsonfsModel({
			assignId: id,
			data: str.slice(i*pice, (i+1)*pice),
			order: i
		});
		jf.save(function(err){
			console.log(err);
		});
	}
};

var jsonfs2str = function(assignId, callback){
	console.log('assignId'+assignId);
	JsonfsModel.find({assignId: assignId}).sort({'order': 1}).exec(function(err, jfs){
		if(err) return callback(err);
		var str = '', len = jfs.length, i;
		for(i=0;i<len;i++){
			console.log(i);
			str += jfs[i].data;
		}
		console.log('typeof str:'+typeof str);
		console.log('len str:'+ str.length);
		callback(null, str);
	})
	// JsonfsModel.find({assignId: assignId}, function(err, jfs){
	// 	if(err) return callback(err);
	// 	var str = '', len = jfs.length, i;
	// 	jfs.sort(function(a,b){
	// 		if(a.order > b.order){
	// 			return 1;
	// 		}else{
	// 			return -1;
	// 		}
	// 	});
	// 	for(i=0;i<len;i++){
	// 		console.log(i);
	// 		str += jfs[i].data;
	// 	}
	// 	console.log('typeof str:'+typeof str);
	// 	console.log('len str:'+ str.length);
	// 	callback(null, str);
	// })
}

module.exports = {
	str2jsonfs: str2jsonfs,
	jsonfs2str: jsonfs2str
}