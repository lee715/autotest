var 
	
	pure = function(str){
    	return Math.round(+str.replace('px', ''));
    },
    isOrdered = function(arr){
    	var len = arr.length, i, flag = arr[0] < arr[len-1], res= true;
    	for(i=0;i<len-1;i++){
    		if(flag && arr[i]>=arr[i+1] || (!flag && arr[i]<=arr[i+1])){
    			res = false;
    			break;
    		}
    	}
    	return res;
    },
	testAnimating = function(startFun, checkFun, duration, section, callback){
		var durms = duration*1000;
		var c = 5;
		var res = [];
		startFun();
		res.push(checkFun(0));
		while(--c){
			setTimeout(function(){
				res.push(checkFun(durms/c));
			}, durms/c);
		};
		setTimeout(function(){
			callback(isOrdered(res));
		}, durms);
	},
	markPass = function(str){
		document.getElementById('results').innerHTML = str || 'PASS';
	},
	markFail = function(str){
		document.getElementById('results').innerHTML = str || 'FAIL';
	};