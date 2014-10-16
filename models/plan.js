var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlanSchema = new Schema({
	version: String,
	time: {type: Date, default: Date.now},
	apk: Buffer,
	times: {type: Number, default:1},
	desc: String
});

mongoose.model('Plan', PlanSchema);
