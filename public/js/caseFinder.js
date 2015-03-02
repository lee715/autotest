var 
	
	fileTemp = '<div class="file-item item" title="{name}">{name}</div>',
	folderTemp = '<div class="folder-item item" title="{name}">{name}</div>',
	bodyTemp = '<input type="hidden" name="layout_module"><div class="header-box"></div><div class="main-box"><input class="search-box" placeholder="搜索case" /><div class="line"></div><div class="folder-box"></div><div class="line"></div><div class="file-box"></div></div>',

	template = function(temp, data){
		return temp.replace(/\{[a-zA-Z0-9_-]+\}/g, function(ma){
			ma = ma.replace(/\{|\}/g, '');
			return data[ma] || '';
		});
	},

	Finder = function(el){
		var $el = this.$el = $(el);
		$el.html(bodyTemp);
		this.$folderBox = $el.find('.folder-box');
		this.$fileBox = $el.find('.file-box');
		this.$searchBox = $el.find('.search-box');
		this.$hiddenInp = $el.find('input[type="hidden"]');
		this.navArr = ['Layout_TestCase/172.17.100.196'];
		this.refresh();
		this.initEvents();
	},

	proty = {
		show: function(){
			this.navArr = ['Layout_TestCase/172.17.100.196'];
			this.refresh();
			this.$el.show();
		},
		hide: function(){
			this.$folderBox.empty();
			this.$fileBox.empty();
			this.$hiddenInp.val('');
			this.$el.hide();
		},
		initEvents: function(){
			var self = this;
			this.$searchBox.keyup(function(){
				self.preSearch();
			});
			this.$el.bind('dblclick', function(e){
				var $t = $(e.target);
				if($t.hasClass('folder-item')){
					self.showFolder($t.html());
				}
			});
			this.$el.bind('click', function(e){
				var $t = $(e.target);
				if($t.hasClass('nav-item')){
					self.nav($t.html());
				}else if($t.hasClass('folder-item') || $t.hasClass('file-item')){
					self.$el.find('.check').removeClass('check');
					$t.addClass('check');
					self.$hiddenInp.val(self.getChecked());
				}
			});
		},
		nav: function(name){
			var ind = this.navArr.indexOf(name);
			this.navArr = this.navArr.slice(0, ind+1);
			this.refresh();
		},
		refresh: function(){
			this.renderHeader();
			this.initBox();
		},
		renderHeader: function(){
			var str = [];
			$.each(this.navArr, function(ind, nav){
				str.push('<a class="nav-item" href="javascript:;">'+nav+'</a>'); 
			});
			this.$el.find('.header-box').html(str.join('/'));
		},
		getCurrent: function(){
			var rt = './'+this.navArr.join('/');
			return Data[rt] || [];
		},
		initBox: function(){
			var da = this.getCurrent();
			this.renderBox(da);
		},
		renderBox: function(da){
			var noFolder = true;
			var noFile = true;
			var fileStr = '';
			var folderStr = '';
			$.each(da, function(ind, d){
				if(/\.[a-zA-Z]+/.test(d)){
					noFile = false;
					fileStr += template(fileTemp, {name: d});
				}else{
					noFolder = false;
					folderStr += template(folderTemp, {name: d});
				}
			});
			if(noFolder){
				this.$folderBox.hide();
				this.$folderBox.prev('.line').hide();
			}else{
				this.$folderBox.show().html(folderStr);
				this.$folderBox.prev('.line').show();
			}
			if(noFile){
				this.$fileBox.hide();
				this.$fileBox.prev('.line').hide();
			}else{
				this.$fileBox.show().html(fileStr);
				this.$fileBox.prev('.line').show();
			}
		},
		preSearch: function(){
			var val = this.$searchBox.val();
			var old = this.$searchBox.data('old');
			if(val.length && val != old){
				this.$searchBox.data('old', val);
				this.search(val);
			}else if(val.length == 0){
				this.$searchBox.data('old', null);
				this.refresh();
			}
		},
		complete: function(i, text){
			var str = text.charAt(i), a, c = i;
			a = text.charAt(--c);
			while(a != ','){
				str = a + str;
				a = text.charAt(--c);
			}
			c = i;
			a = text.charAt(++c);
			while(a != ','){
				str += a;
				a = text.charAt(++c);
			}
			return str;
		},	
		search: function(str){
			var qstr = ',' + this.getCurrent().join(',') + ',',
				complete = this.complete,
				res = [];
			qstr.replace(new RegExp(str, 'g'), function(ma, i){
				res.push(complete(i, qstr));
			});
			this.renderBox(res);
		},
		showFolder: function(name){
			this.navArr.push(name);
			this.refresh();
		},
		getChecked: function(){
			var pre = this.navArr.slice(1).join('/'),
				item = this.$el.find('.check').html();
			return pre.length?pre + '/' + item:item;
		}
	};

	$.extend(Finder.prototype, proty);