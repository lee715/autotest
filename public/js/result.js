var Results = {};

// utils
var template = function(temp, data){
	var rg = /\{[\w\+\s]+\}/g;
	var rg_trim = /[\{\}\s]+/g;
	return temp.replace(rg, function(ma){
		ma = ma.replace(rg_trim, '');
		if(/\+/.test(ma)){
			var arr = ma.split('+');
			var res = 0, d;
			while(d = arr.pop()){
				res += +data[d];
			}
			return res;
		}else{
			return data[ma];
		}
	});
}

// datas maped by id
var Data = {
	get: function(id){
		return pageCtrl.getById(id);
	}
};

// id controller
var idCtrl = {
	get: function(){
		return localStorage.getItem('selectedIds') || '';
	},
	push: function(id){
		var ids = this.get()+','+id;
		this.set(ids);
		return ids;
	},
	set: function(ids){
		localStorage.setItem('selectedIds', ids);
		this.refreshRelatedHandler();
	},
	refreshRelatedHandler: function(){
		var ids = this.getIds();
		$('.result-item-checkbox').each(function(i, item){
			item.checked = false;
		});
		if(ids.length){
			$.each(ids, function(i, id){
				var $el = $('#'+id+' input[type="checkbox"]');
				if($el.length)
					$el[0].checked = true;
			});
			$('#diff-handler')[0].href = '/diff?ids=' + ids.join(',');
		}else{
			$('#diff-handler')[0].href = 'javascript:;';
		}

	},
	remove: function(id){
		var ids = this.get().replace(','+id, '');
		this.set(ids);
		return ids;
	},
	getIds: function(){
		var idstr = this.get();
		if(idstr){
			return idstr.slice(1).split(',');
		}else{
			return [];
		}
	},
	clear: function(){
		this.set('');
	},
	init: function(){
		if(this.get()){
			var ids = this.getIds();
			$.each(ids, function(i, id){
				var $el = $('#'+id+' input[type="checkbox"]');
				if($el.length)
					$el[0].checked = true;
			});
		}else{
			this.set('');
		}
	},
	cur: null
};

// page controller
var $pageCtrl = $('#pager');
// 有多页，需分页
if($pageCtrl.length){
	var pageCtrl = {
		cur: 1,
		_data: {},
		_dataById: {},
		temp: $('#li-temp').html(),
		getById: function(id){
			return this._dataById[id];
		},
		getByPage: function(page, cb){
			if(this._data[page]){
				cb.call(this, this._data[page])
			}else{
				this.fetch(page, cb);
			}
		},
		storeData: function(data, page){
			var self = this;
			$.each(data, function(i, d){
				d.id = d._id;
				self._dataById[d.id] = d;
			});
			this._data[page] = data;
		},
		fetch: function(page, cb){
			var self = this;
			$.ajax({
				url: '/fetchByPage',
				data: { page: page }
			})
			.done(function(res){
				if(res.data && res.page){
					self.storeData(res.data, res.page);
					self.setCur(res.page);
					cb && cb.call(self, res.data);
				}
			})
		},
		go: function(page){
			if(!page) page = $pageCtrl.find('input').val();
			this.fetch(page, this.render);
		},
		prev: function(){
			this.go(this.cur-1);
		},
		next: function(){
			this.go(this.cur+1);
		},
		setCur: function(page){
			this.cur = +page;
			$pageCtrl.find('input').val(page);
		},
		render: function(arr){
			var str = '', temp = this.temp;
			$.each(arr, function(i, d){
				str += template(temp, d);
			});
			$('#resultlist').html(str);
			$('#resultlist .show-detail-handler').click(function(e){
				showPanel(this);
				e.stopPropagation(e);   
				return false; 
			});
			idCtrl.init();
		},
		init: function(){
			idCtrl.set('');
			this.go(1);
		}
	};
	pageCtrl.init();
};

// search related
var temp = '<li><span>{name}</span><a target="_blank" href="{url}" class="file"></a></li>';
var renderItems = function(arr){
	var str = ''; 
	$.each(arr, function(ind, data){
		var url = ('/getByDir?id='+idCtrl.cur+'&dir='+data).replace(/\.[a-zA-Z0-9]+$/, '-result.txt');
		str += temp.replace('{name}', data).replace('{url}', url);
	});
	return str;
};
var findType = function(){
	var $el = $('.show').find('.num');
	if($el.hasClass('red')){
		type = 'red';
	}else if($el.hasClass('blue')){
		type = 'blue';
	}else if($el.hasClass('yellow')){
		type = 'yellow';
	}
	return type;
};
var search  = function(text){
	var type = findType();
	var items = Results[idCtrl.cur][type];
	var res = [];
	if(!text){
		res = items;
	}else{
		$.each(items, function(ind, item){
			if(~item.indexOf(text)) res.push(item); 
		});
	}
	console.log('match items num:'+res.length);
	$('.show').find('ul').html(renderItems(res));
};
$('#searchInput').keyup(function(){
	search(this.value);
})

// pager related
var check = function(el){
	var id = $(el).parent().attr('id');
	var ids = idCtrl.get();
	if(~ids.indexOf(id)){
		ids = idCtrl.remove(id);
	}else{
		ids = idCtrl.push(id);
	}
};

// float panel related
var showPanel = function(el){
	var id = $(el).data('id');
	var data = Data.get(id);
	if(data){
		$('#panel .green').html(data.passed ||0);
		$('#panel .red').html(data.failed || 0);
		$('#panel .blue').html(data.nontext || 0);
		$('#panel .yellow').html(data.crashed || 0);
		$('#version-span').html(data.version);
		$('#desc-span').html(data.desc);
		$('#time-span').html(data.time);
		idCtrl.cur = id.replace(/"|"/g, '');
		$('.ulInited').removeClass('ulInited');
		$('.show').removeClass('show');
		$('#searchInput').val('');
		$('#panel').addClass('r0');
	}
	return false;
};
$(document).click(function(e){
	if($('#panel').hasClass('r0') && $(e.target).closest('#panel').length == 0){
		$('#panel').removeClass('r0')
	}
});
var map = {
	'red': 'layout_tests_failed.txt',
	'blue': 'layout_tests_nontext.txt',
	'yellow': 'layout_tests_crashed.txt'
}
$('.num').click(function(){
	var self = this;
	var type;
	$('#searchInput').val('');
	if($(this).hasClass('red')){
		type = 'red';
	}else if($(this).hasClass('blue')){
		type = 'blue';
	}else if($(this).hasClass('yellow')){
		type = 'yellow';
	}
	if(!$(this).parent().hasClass('show') && !$(this).hasClass('ulInited')){
		$.ajax({
			url: '/getByDir',
			data:{
				id: idCtrl.cur,
				dir: map[type]
			}
		})
		.done(function(txt){
			var items = txt
				.replace(/[\n|\s]+/g, ',')
				.replace(/^,|,$/g, '')
				.replace(/\/storage\/emulated\/0\/webkit\/layout_tests/g, '')
				.split(',');
			if(!Results[idCtrl.cur]) Results[idCtrl.cur] = {};
			Results[idCtrl.cur][type] = items;
			$(self).parent().find('ul').html(renderItems(items));
			$(self).addClass('ulInited');
		});
	}else if(!$(this).parent().hasClass('show') && $(this).hasClass('ulInited')){
		$(self).parent().find('ul').html(renderItems(Results[idCtrl.cur][type]));
	}
	if(!$(this).parent().hasClass('show')) $('.show').removeClass('show');
	$(this).parent().toggleClass('show');
});

// chart related
$('#showChart').click(function(){
	var ids = idCtrl.get().slice(1).split(',');
	var arr = [];
	$.each(ids, function(i, id){
		arr.push(Data.get(id));
	});
	ChartCtrl.create(arr);
});