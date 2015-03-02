var firstLetterUp = function(str){
	return str.charAt(0).toUpperCase() + str.slice(1);
}

var buildEventName function(event){
	return 'on' + firstLetterUp(event);
}

var each = function(arr, func){
	for(var i=0,l=arr.length;i<l;i++){
		if(!func(i, arr[i]))
			break;
	}
}

var _hasProp = {}.hasOwnProperty,
var __extends = function(child, parent) { 
	for (var key in parent) { 
		if (__hasProp.call(parent, key)) child[key] = parent[key]; 
	} 
	function ctor() { 
		this.constructor = child; 
	} 
	ctor.prototype = parent.prototype; 
	child.prototype = new ctor(); 
	child.__super__ = parent.prototype; 
	return child; 
};

var callOnceByPriority = function(){
	var prioArr = [].slice.call(arguments).reverse();
	var callOne = function(arr, args){
		var obj = arr[0];
		var funNames = arr.slice(1);
		var notCalled = true;
		each(funNames, function(i, name){
			if(obj[name]){
				obj[name].apply(args[0], args.slice(1));
				notCalled = false;
				return false;
			}else{
				return true;
			}
		});
		return notCalled;
	}
	return function(){
		var args = [].slice.call(arguments);
		each(prioArr, function(i, prio){
			return callOne(prio, args)
		});	
	}
}

function Pager(opts){
	opts = this.opts = opts || {};
	this.cur = opts.current || 1;
	this.total = opts.total || Infinity;
	return this;
}

Pager.prototype.prev = function(){
	this.go(this.cur-1);
}

Pager.prototype.next = function(){
	this.go(this.cur+1);
}

Pager.prototype.format = function(page){
	if(page<1) 
		page = 1;
	else if(page > this.total)
		page = this.total;
	return page;
}

Pager.prototype.go = function(page){
	page = format(page);
	// page changed, refresh the dom and trigger change
	if(page != this.cur){
		this.cur = page;
		this.trigger('change');
	}
}

Pager.prototype.trigger = function(event){
	var evName = buildEventName(event);
	// inner watch
	var localFn = this[evName];
	localFn && localFn.call(this);
	// custom bounding
	var customFn = this.opts[evName];
	customFn && customFn.call(this, this.cur);
}

Pager.prototype.onChange = function(){
	this.refresh();
}

// refresh the dom of pager
Pager.prototype.refresh = function(){
	var opts = this.opts;
	var func = this.opts.refresh || this.opts.render || this.render;
	func.call(this, this.cur);
}

function PagerWithData(opts){
	
}