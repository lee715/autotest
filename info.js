/*
  info.js holds the running informations of the current task.
*/
var _ = require('./libs/underscore.js');

var info_default = {
	status: 'free', // free, testing, checking, pushing
	total: 0,
	done: 0
}

var info = {
	status: 'free', // free, testing, checking, pushing
	total: 0,
	done: 0,
	q: 0
};

module.exports = {
	status: function(st){
		info.status = st;
	},
	total: function(total){
		info.total = total;
	},
	done: function(num){
		info.done += num;
	},
	init: function(obj){
		info = _.extend({}, info_default, obj||{});
	},
	get: function(){
		return info;
	}
}