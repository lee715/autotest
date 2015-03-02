var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
	owner: {type: String, default:'0'},
	time: {type: Date, default: Date.now},
	path: String,
	changes: {type: Array, default: []},
	expected: String,
	result: String,
	status: {type: String, default: 'open'},
	doneTime: Date
});

mongoose.model('Todo', TodoSchema);
