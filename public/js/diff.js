var data = {passed: {}, failed: {}, nontext: {}, crashed: {}};
var counter = 8;
var orders = "layout_tests_passed.txt layout_tests_failed.txt layout_tests_nontext.txt layout_tests_crashed.txt".split(' ');
var _orders = "passed failed nontext crashed".split(' ');
var ids = location.href.split('?')[1].split('=')[1].split(',').slice(0, 2);
var done = function(){
	counter--;
	if(!counter){
		var passP = data.passP = diff(data.passed[ids[1]], data.passed[ids[0]]);
		var passD = data.passD = diff(data.passed[ids[0]], data.passed[ids[1]]);
		data.failedP = diff(data.failed[ids[1]], data.failed[ids[0]]).join(',');
		data.failedD = diff(data.failed[ids[0]], data.failed[ids[1]]).join(',');
		data.nontextP = diff(data.nontext[ids[1]], data.nontext[ids[0]]).join(',');
		data.nontextD = diff(data.nontext[ids[0]], data.nontext[ids[1]]).join(',');
		data.crashedP = diff(data.crashed[ids[1]], data.crashed[ids[0]]).join(',');
		data.crashedD = diff(data.crashed[ids[0]], data.crashed[ids[1]]).join(',');
		renderUl($('#passP .case'), passP, '<li class="header">新增的成功项</li>');
		renderUl($('#passD .case'), passD, '<li class="header">减少的成功项</li>');
		renderNowOrLast($('#passP .now'),  passP.length);
		renderNowOrLast($('#passP .last'), passP, 'failedD nontextD crashedD'.split(' '));
		renderNowOrLast($('#passD .now'), passD, 'failedP nontextP crashedP'.split(' '));
		renderNowOrLast($('#passD .last'),  passD.length);
		//- renderUl($('#failP ul'), diff(data.failed[ids[1]], data.failed[ids[0]]));
		//- renderUl($('#failD ul'), diff(data.failed[ids[0]], data.failed[ids[1]]));
		//- renderUl($('#nontextP ul'), diff(data.nontext[ids[1]], data.nontext[ids[0]]));
		//- renderUl($('#nontextD ul'), diff(data.nontext[ids[0]], data.nontext[ids[1]]));
		//- renderUl($('#crashP ul'), diff(data.crashed[ids[1]], data.crashed[ids[0]]));
		//- renderUl($('#crashD ul'), diff(data.crashed[ids[0]], data.crashed[ids[1]]));
		renderTablePassD(passD);
	}
}
var renderUl = function($el, items, str){
	var str = str || "";
	$.each(items, function(i, item){
		str += '<li>'+item+'</li>';
	});
	$el.html(str);
};
var buildFileUrl = function(id, filename){
	return ('/getByDir?id=' + id + '&dir=' + filename).replace(/\.[a-zA-Z0-9]+$/, '-result.txt');
};
var renderNowOrLast = function($el){
	var id, str, isNow = $el.hasClass('now'),
		elId = $el.parent().attr('id'); 
	if(isNow){
		id = ids[0];
		str = '<li class="header">本次结果</li>';
	}else{
		id = ids[1];
		str = '<li class="header">上次结果</li>';
	}
	if(arguments.length == 2){
		var temp = '<li class="green">passed';
		var len = arguments[1];
		var i = 0;
		while(i<len){
			str += temp + '<a class="file" target="_blank" href="'+buildFileUrl(id, data[elId][i])+'"></a></li>';
			i++;
		} 
	}else{
		var items = arguments[1];
		var checkList = arguments[2];
		$.each(items, function(ind, item){
			var find = false;
			$.each(checkList, function(i, type){
				if(~data[type].indexOf(item)){
					find = true;
					str += getStrByType(type);
				} 
			});
			if(!find){
				console.log(item);
				$.each('passed failed nontext crashed'.split(' '), function(ind, t){
					if(~data[t][ids[0]].join(',').indexOf(item)){
						console.log(t);
					}else{
						console.log('not find in '+t);
					}
				});
				str += '<li>null</li>';
			}else{
				str += '<a class="file" target="_blank" href="'+buildFileUrl(id, data[elId][ind])+'"></a></li>';
			}
		});
	}
	$el.html(str);
};
var getStrByType = function(type){
	switch(type){
		case 'failedP':
		case 'failedD':
			return '<li class="red">failed';
		case 'crashedP':
		case 'crashedD':
			return '<li class="yellow">crashed'
		case 'nontextP':
		case 'nontextD':
			return '<li class="blue">nontext'
	}
	return '<li>null</li>';
};
var renderTablePassD = function(list){
	var str = '<tr><td colspan="6" style="text-align:left;">减少的成功项</td><tr>';
	$.each(list, function(ind, item){
		str += '<tr><td colspan="6" style="text-align:left;">'+item+'</td><tr>';
	});
	$('#reviewTable').append(str);
}
$.each(ids, function(i, id){
	$.ajax({
		url: '/getResultById',
		data: {
			id: id
		}
	})
	.done(function(res){
		var str = '<tr>';
		str += '<td>'+res.version+'</td>'+
				'<td>'+(res.passed+res.failed+res.crashed+res.nontext)+'</td>'+
				'<td>'+res.passed+'</td>'+
				'<td>'+res.failed+'</td>'+
				'<td>'+res.crashed+'</td>'+
				'<td>'+res.nontext+'</td></tr>';
		$('#reviewTable').append(str);
	})
	$.each(orders, function(ind, order){
		$.ajax({
			url: '/getByDir',
			data: {
				id: id,
				dir: order
			}
		})
		.done(function(txt){
			console.log('done', txt);
			var items = txt
				.replace(/[\n|\s]+/g, ',')
				.replace(/^,|,$/g, '')
				.replace(/\/storage\/emulated\/0\/webkit\/layout_tests/g, '')
				.split(',');
			var key = _orders[ind];
			data[key][id] = items;
			done();
		});
	});
	
});
var diff = function(arr1, arr2){
	var arrStr = arr1.join(','), res = [];
	$.each(arr2, function(i, a){
		if(!~arrStr.indexOf(a)){
			res.push(a);
		}
	});
	return res;
}