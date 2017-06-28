
var app = angular.module('myApp', ['chart.js']);
var openWeatherId = '5479d81c00c85979b58d1f6e0f2fd8f0';
var openWeatherUrl= 'http://api.openweathermap.org/data/2.5';

app.controller('AppCtrl',['$scope','$http',function($scope,$http){
  var fnGetCurrentForecast = function(id){
	  var weather = {main:'',
					description:'',
					icon:'',
					temp_min:'',
					temp_max:'',
					windspd:'',
					temp:''}
		$http.get(openWeatherUrl+"/weather?id="+id+"&units=metric&appid="+openWeatherId).then(function(response){
			response =  response.data;
			weather.main = response.weather[0].main;
			weather.description = response.weather[0].description;
			weather.icon = response.weather[0].icon;
			weather.temp_min =  response.main.temp_min;
			weather.temp_max = response.main.temp_max;
			weather.temp    = response.main.temp;
			weather.windspd = response.wind.speed;
				
		},function(error){
			console.log(error);
		});			
	  
	  return weather
  };
  
  var cityList = [
		{
			id:'3164603',
			name:'Venezia',
			country:'IT'},
		{
			id:'524901',
			name:'Moscow',
			country:'RU'},
		{
			id:'2964574',
			name:'Dublin',
			country:'IE'},
		{
			id:'3128760',
			name:'Barcelona',
			country:'ES'},
		{
			id:'2650225',
			name:'Edinburgh',
			country:'GB'}		  
    ];
  
	angular.forEach(cityList, function(item, key) {
	  cityList[key].weather = fnGetCurrentForecast(item.id);
	});
  
  $scope.arrCities = cityList;
  $scope.fnGetCompleteForecast = function(id){
	  
		$http.get(openWeatherUrl+"/forecast?id="+id+"&units=metric&appid="+openWeatherId).then(function(response){
			response =  response.data;
			var completeFore = {labels:[],
								data:[],
								weather:[]}; 
			//var nDtForecast = response.list[0].dt_txt.split(' ')[0].split('-')[2];
			angular.forEach(response.list, function(item, key){
				//var nDtkey = item.dt_txt.split(' ')[0].split('-')[2];
				if(key < 11){
					var hMin = item.dt_txt.split(' ')[1].split(':');
					completeFore.labels[key] = hMin[0] + ":" + hMin[1];
					completeFore.data[key] = item.main.temp;
					item.weather[0].time = hMin[0] + ":" + hMin[1];
					item.weather[0].day =item.dt_txt.split(' ')[0].split('-')[2] + "/" +item.dt_txt.split(' ')[0].split('-')[1];
					completeFore.weather[key] = item.weather[0];
				}
			});


			  $scope.forecastComplete = completeFore.weather;	
			  $scope.labels = completeFore.labels;
			  $scope.series = ['Day'];
			  $scope.data = [
				completeFore.data
			  ];
			  $scope.onClick = function (points, evt) {
				console.log(points, evt);
			  };
			  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
			  $scope.options = {
				responsive:true,
				scales: {
				  yAxes: [
					{
					  id: 'y-axis-1',
					  type: 'linear',
					  display: true,
					  position: 'left',
					  ticks: {
								beginAtZero:true
							}
					}
				  ]
				}
			  };
			  $scope.chart_id = {
				"height":"390px"
			  };
		},function(error){
			console.log(error);
		});			
  };
    
}]);
