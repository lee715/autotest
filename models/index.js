var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.connect(config.db_url, function(err){
	if(err){
		console.log("connect to db error: "+err.message);
		process.exit(1);
	}
	// var db = mongoose.connection;
	// var GridStore = require('mongodb').GridStore;
	// var ObjectID = require('mongodb').ObjectID;

	// var mygrid = new GridStore(db, 'mygrid', 'r');
	// mygrid.open(function(err, gs){
	// 	gs.write('holle world', function(err, gs){
	// 		if(err) console.log(err);
	// 		gs.close(function(err, res){
	// 			if(err) console.log(err);
	// 		})
	// 	})
	// });
});

require('./plan');
require('./result');
require('./todo');
require('./jsonfs');

module.exports = {
	Result: mongoose.model('Result'),
	Todo: mongoose.model('Todo'),
	Plan: mongoose.model('Plan'),
	Jsonfs: mongoose.model('Jsonfs')
}
