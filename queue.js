
var exec = require('child_process').exec,
	fs = require('fs'),
	Data = require('./data.js'),

	Models = require('./models/index.js'),
	Result = Models.Result,

	q = [],

	running = false,

	add = function(plan){
		console.log('add check');
		console.log(plan);
		if(!plan.path || !plan.version || !plan.module) return false;
		console.log('add start');
		q.push(plan);
		if(!running) run();
	},

	run = function(){
		console.log('run check');
		console.log(q.length);
		if(running || q.length == 0) return false;
		console.log('run start');
		running = true;
		var plan = q.shift();
		console.log('install apk');
		// 安装测试包 
		command('adb install -r '+plan.path, function(err){
			if(err) throw err;
			console.log('start apk');
			var line = 'python E:\\lilei\\run_layout_tests.py --refresh-test-list '+plan.module;
			// 指示手机开始测试
			command(line, function(err, stdout, stderr){
				// var order = ['notext','crashed','results','fail','pass','done'];
				// var r = {};
				// stderr.replace(/\d+/g, function(ma){
				// 	var n = order.pop();
				// 	r[n] = +ma;
				// });
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
				
				// data目录下保存测试结果
				// command('md public\\data\\r'+a._id, function(err){
				// 	if(!err){
				// 		command('xcopy layout-test-results public\\data\\r' +a._id+ ' /s', function(){
				// 			command('rmdir /s/q layout-test-results');
				// 			running = false;
				// 			run();
				// 		})
				// 	}
				// });
				Data.store(function(err, data){
					a.json = JSON.stringify(data);
					a.save();
					console.log('save result');
					running = false;
					run();
				});
			});
		})
	},

	command = function(line, cb){
		exec(line, cb);
	};


module.exports = {
	add: add
}