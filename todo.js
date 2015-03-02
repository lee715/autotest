var fs = require('fs');
var _ = require('./libs/underscore.js');
var Models = require('./models/index.js');
var TodoModel = Models.Todo;
var exec = require('child_process').exec;
var config = require('./config.js');

var isExist = function(){
	return fs.existsSync('./public/data/todo.txt');
}

var getData = function(){
	if(isExist()){
		var jstr = fs.readFileSync('./public/data/todo.txt');
		return JSON.parse(jstr);
	}else{
		return {};
	}
}

var writeData = function(data){
	fs.writeFile('./public/data/todo.txt', JSON.stringify(data), function(err){
		if(err)
			console.log('merge todo file error:'+err);
		else
			console.log('merge todo file ok!');
	});
}

var isInThisWeek = function(date){
	var old = (new Date(date)).getTime();
	var now = (new Date()).getTime();
	if(now - old < 5*24*60*60*1000){
		return true;
	}else{
		return false;
	}
}

var path2expath = function(path){
	return path.replace(/\.[a-zA-Z]+$/, '-expected.txt');
}

var makeTodoModule = function(module){
	var count = 10;
	var arr = [];
	while(count--){
		arr.push(config.base_url+module);
	}
	return arr.join("\t\r\n");
}

module.exports = {
	makeTodoModule: makeTodoModule,
	pushToMobile: function(path, cb){
		console.log(path);
		exec('cd Layout_TestCase;cd 172.17.100.196;svn update;', function(err){
			if(err) console.log(err);
			var  command1 = 'adb push '+config.base_url+path+' /sdcard/webkit/layout_tests'+path;
			var expath = path2expath(path);
			var command2 = 'adb push '+config.base_url+expath+' /sdcard/webkit/layout_tests'+expath;
			var err = null;
			exec(command1, function(e){
				if(e) err = e;
			});
			exec(command2, function(e){
				if(e) err = e;
			});
			cb && cb(err);
		});
	},
	removeFromMobile: function(path, cb){
		var  command1 = 'adb shell rm /sdcard/webkit/layout_tests'+path;
		var expath = path2expath(path);
		var command2 = 'adb shell rm /sdcard/webkit/layout_tests'+expath;
		exec(command1, function(e){
			if(e) return cb(e);
			exec(command2, function(e){
				if(e) return cb(e);
				cb(null)
			})
		})
	},
	merge: function(obj){
		var data = getData();
		obj = obj || {};
		data = _.extend(data, obj);
		writeData(data);
	},
	get: function(){
		return getData();
	},
	getItems: function(){
		var data = getData();
		return _.keys(data);
	},
	markDone: function(key){
		var data = getData();
		if(data[key])
			delete data[key];
		writeData(data);
	},
	getDaliyTask: function(owner, cb){
		var num = 20;
		TodoModel.find({owner:'0', status:'open'}).limit(num).exec(function(err, todos){
			if(err){
				console.log(err);
				cb('err in find');
			}else{
				_.each(todos, function(todo){
					todo.owner = owner;
					todo.save();
				})
				cb(null, todos);
			}
		})
	},
	toDB: function(){
		var obj = this.get();
		var keys = this.getItems();
		console.log('todo '+keys.length);
		var count = 1;
		for(var i=0,l=keys.length;i<l;i++){
			var path = keys[i];
			var result = obj[path][0];
			var expected = obj[path][1];
			(function(path, result, expected, index){
				TodoModel.find({"path": path}).exec(function(err, todo){
					if(err) console.log(err);
					console.log('no err '+index);
					todo = todo[0];
					if(todo){
						if(todo.status == 'done' && !isInThisWeek(todo.time)){
							todo.status = 'open';
							todo.save();
						}else{
							return;
						}
					}else{
						console.log('no todo '+index);
						var t = new TodoModel();
						t.path = path;
						t.expected = expected;
						t.result = result;
						t.save(function(err){
							if(!err)
								console.log('done, '+ count++);
							else
								console.log('err when save '+index);
						});
					}
				})
			})(path, result, expected, i)
		}
		writeData({});
	}
}