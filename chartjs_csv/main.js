var isIE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Trident') !== -1;

var chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

var colorNames = Object.keys(chartColors);
var target = document.getElementById("time");
var time_count = 0

//CSVファイルを読み込む関数getCSV()の定義
function getCSV(){
  var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
  req.open("get", "data/test.csv", true);
  req.send(null); 

  // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
  req.onload = function(){
    data = convertCSVtoArray(req.responseText);
    return data
  }
}

// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str){ 
  var result = []; 
  var tmp = str.split("\n");
  for(var i=0;i<tmp.length;++i){
      result[i] = tmp[i].split(',');
  }
  return result
}

function onRefresh(chart) {
  time_count = time_count + 1
	chart.config.data.datasets.forEach(function(dataset) {
    target.innerHTML = Date.parse(data[time_count][1]);
		dataset.data.push({
			x: Date.parse(data[time_count][1]),
			y: data[time_count][2]
		});
	});
}

var color = Chart.helpers.color;
var config = {
	type: 'line',
	data: {
		datasets: [{
			label: 'Dataset 1 (linear interpolation)',
			backgroundColor: color(chartColors.red).alpha(0.5).rgbString(),
			borderColor: chartColors.red,
			fill: false,
			lineTension: 0,
			borderDash: [8, 4],
			data: []
		}, {
			label: 'Dataset 2 (cubic interpolation)',
			backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
			borderColor: chartColors.blue,
			fill: false,
			cubicInterpolationMode: 'monotone',
			data: []
		}]
	},
	options: {
		title: {
			display: true,
			text: 'Dow Jones Industrial Average'
		},
		scales: {
			xAxes: [{
				type: 'realtime',
				realtime: {
					duration: 86400000,
					ttl: 86400000 *7,
					refresh: 1000,
					delay: 0,
					pause: false,
					onRefresh: onRefresh
				}
			}],
			yAxes: [{
				type: 'linear',
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'value'
				}
			}]
		},
		tooltips: {
			mode: 'nearest',
			intersect: false
		},
		hover: {
			mode: 'nearest',
			intersect: false
		},
		plugins: {
			streaming: {
				frameRate: 30
			}
		}
	}
};

window.onload = function() {
	var ctx = document.getElementById('myChart').getContext('2d');
  window.myChart = new Chart(ctx, config);
  var data = getCSV(); 
}

var colorNames = Object.keys(chartColors);

document.getElementById('duration').addEventListener(isIE ? 'change' : 'input', function() {
	config.options.scales.xAxes[0].realtime.duration = +this.value[0] * 86400000;
	window.myChart.update({duration: 0});
	document.getElementById('durationValue').innerHTML = this.value + '日';
});

document.getElementById('refresh').addEventListener(isIE ? 'change' : 'input', function() {
	config.options.scales.xAxes[0].realtime.refresh = +1000/(this.value/3600);
	window.myChart.update({duration: 0});
	document.getElementById('refreshValue').innerHTML = this.value;
});

document.getElementById('pause').addEventListener('change', function() {
	config.options.scales.xAxes[0].realtime.pause = this.checked;
	window.myChart.update({duration: 0});
	document.getElementById('pauseValue').innerHTML = this.checked;
});