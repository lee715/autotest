module.exports = function(err){
	console.log(err);
	var content = 'unknown';
	if(typeof err == 'string'){
		content = err;
	}else if(err.message){
		content = err.message;
	}else if(err.toString){
		content = err.toString();
	}
	
}