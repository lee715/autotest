var mongoose = require('mongoose');
var config = require('../config.js').config;

mongoose.connect(config.db_url, function(err){
	if(err){
		console.log("connect to db error: "+err.message);
		process.exit(1);
	}
});

require('./plan');
require('./result');

module.exports = {
	Result: mongoose.model('Result'),
	Plan: mongoose.model('Plan')
}
