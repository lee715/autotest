var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JsonfsSchema = new Schema({
	assignId: String,
	data: String,
	order: Number
});

mongoose.model('Jsonfs', JsonfsSchema);
