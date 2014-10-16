var ChartCtrl = 
	
	(function(){

		var Color = {
			map: {
				passed: 'green',
				failed: 'red',
				crashed: 'yellow',
				nontext: 'blue'
			},
			green: '#5cb85c',
			darkgreen: '#4cae4c',
			red: '#d9534f',
			darkred: '#d43f3a',
			yellow: '#f0ad4e',
			darkyellow: '#eea236',
			blue: '#31b0d5',
			darkblue: '#269abc',
			get: function(color){
				if(this.map[color])
					return this[ this.map[ color ] ];
				else
					return this[color];
			},
			getRGB: function(color){
				var code = this.get(color);
				var rgb = this.compute(code);
				return 'rgb(' + rgb.join(',') + ')'; 
			},
			getRGBA: function(color, a){
				var code = this.get(color);
				var rgb = this.compute(code);
				rgb.push(a);
				return 'rgba(' + rgb.join(',') + ')'; 
			},
			compute: function(code){
				if(code.charAt(0)=='#') code = code.slice(1);
				var res = [];
				res[0] = parseInt(code.slice(0,2), 16);
				res[1] = parseInt(code.slice(2,4), 16);
				res[2] = parseInt(code.slice(4,6), 16);
				return res;
			}
		}

		var myChart = {
			create: function(arr){
				var data = this.parse(arr);
				this.render();
				var ctx = $("#canvas")[0].getContext("2d");
				new Chart(ctx).Line(data);
			},
			parse: function(arr){
				var data = {
					labels: [],
					datasets: [
						{pointStrokeColor : "#fff", data: []},
						{pointStrokeColor : "#fff", data: []}
					]
				};
				var map = 'passed failed crashed'.split(' ');
				var keys = 'fillColor strokeColor pointColor'.split(' ');
				var opas = [0.2, 1, 1];
				$.each(arr, function(i, item){
					data.labels.push(item.apkname.match(/\d+/)[0].slice(0, 8));
					$.each(data.datasets, function(m, dataset){
						$.each(keys, function(n, key){
							dataset[key] = Color.getRGBA(map[m], opas[n]);
						});
						if(m){
							dataset.data.push(+item[ map[m] ] + +item[ map[m+1] ]);
						}else{
							dataset.data.push(item[ map[m] ]);
						}
					})
				});
				return data;
			},
			render: function(){
				$('.chartWrapper').remove();
				var str = '<div class="chartWrapper"><canvas id="canvas" height="500" width="600" style="width: 500px; height: 600px;"></canvas><p><span class="green-legend"></span><span class="legend-text">Passed</span><span class="red-legend"></span><span class="legend-text">Failed+Crashed</span></p><a class="close-handler">x</a></div>';
				$('body').append(str);
				$('.close-handler').click(function(){
					$('.chartWrapper').remove();
				});
			}
		};
		window.Color = Color;
		return myChart;

	})();