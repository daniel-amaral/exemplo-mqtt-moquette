'use strict';

var app = angular.module('app', ['ngAnimate', 'nvd3']);

app.controller('controller', ['$scope', '$http', '$interval', '$timeout',  function($scope, $http, $interval, $timeout){

	$scope.refreshMode = 'manual';

	$scope.temperatureChart = {
		options: {
			chart: {
			    type: 'discreteBarChart',
			    height: 150,
			    margin : {
			        top: 20,
			        right: 20,
			        bottom: 50,
			        left: 55
			    },
			    x: function(d){return d.label;},
			    y: function(d){return d.value;},
			    showValues: true,
			    valueFormat: function(d){
			        return d3.format(',.2f')(d);
			    },
			    duration: 500,
			    xAxis: {
			        axisLabel: 'Amostras'
			    },
			    yAxis: {
			        axisLabel: 'Temperatura °C',
			        axisLabelDistance: -10
			    },
			    color: [
			    	"#146386"
			    ]
			}
		},
		data: [
			{
			    key: "data1",
			    values: []
		}]

	};

	$scope.humidityChart = {
		options: {
			chart: {
			    type: 'discreteBarChart',
			    height: 150,
			    margin : {
			        top: 20,
			        right: 20,
			        bottom: 50,
			        left: 55
			    },
			    x: function(d){return d.label;},
			    y: function(d){return d.value;},
			    showValues: true,
			    valueFormat: function(d){
			        return d3.format(',.2f')(d);
			    },
			    duration: 500,
			    xAxis: {
			        axisLabel: 'Amostras'
			    },
			    yAxis: {
			        axisLabel: 'Umidade (%)',
			        axisLabelDistance: -10
			    },
			    color: [
			    	"#bd6905"
			    ]
			}
		},
		data: [
			{
			    key: "data2",
			    values: []
		}]
	}



	$timeout(function() {
		$scope.api.refresh();
		$scope.api2.refresh();
	}, 500);

	$scope.refreshTempChart = function(){
		$http.get('/temperature-data-from-broker')
			.then(function(response){
				var message = response.data;
				var localData = $scope.temperatureChart.data[0].values;
				var actualSize = localData.length;
				for(var item of message){
					localData.push({
						label: '' + ++actualSize,
						value: Number(item)
					})
				}
				$scope.api.refresh();
			})
	}

	$scope.refreshHumidityChart = function(){
		$http.get('/humidity-data-from-broker')
			.then(function(response){
				var message = response.data;
				var localData = $scope.humidityChart.data[0].values;
				var actualSize = localData.length;
				for(var item of message){
					localData.push({
						label: '' + ++actualSize,
						value: Number(item)
					})
				}
				$scope.api2.refresh();
			})
	}


	var refreshIntervalInSecs = 6;

	$interval(function(){
		if($scope.refreshMode === 'auto'){
			$scope.refreshTempChart();
			$scope.refreshHumidityChart();
		}
	}, refreshIntervalInSecs * 1000)

}]);