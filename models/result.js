var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResultSchema = new Schema({
	version: String,
	desc: String,
	passed: Number,
	failed: Number,
	nontext: Number,
	crashed: Number,
	time: {type: Date, default: Date.now},
	module: String,
	apkname: String,
	json: String
});

mongoose.model('Result', ResultSchema);
