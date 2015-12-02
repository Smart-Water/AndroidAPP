angular.module('app.controllers', ['ionic','highcharts-ng'])

.controller('loginCtrl', function($scope, $http, $ionicPopup, $state,$localstorage)  {
  $scope.user = {};

  $scope.loginFunction = function() {
    $http.get('http://smart-water.tk/api/user/'+$scope.user.cpf+'/'+$scope.user.password).success(function(data) {
      if(data == 'false') {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      } else {
        $scope.user = data;
        data.password = '';
        window.localStorage['user'] = JSON.stringify(data);
        if($scope.user.access_level == 2) {
          $state.go('menu.dashboard');
        }
      }
    });
  };
})

.controller('dashboardCtrl', function($scope, $http, $rootScope, $location, $localstorage) {

  $rootScope.activetab = $location.path();
  var user = $localstorage.getObject('user');

  function setGeneralTotal(){
    $http.get('http://smart-water.tk/api/report/totalByUser/'+user.cpf).success(function(data) {
      $rootScope.generalCounter = data.total;
      $rootScope.lastUpdate = data.last_update;
    });

    setTimeout(function() {
      setInterval(function() {
        $http.get('http://smart-water.tk/api/report/totalByUser/'+user.cpf).success(function(data) {
          $rootScope.generalCounter = data.total;
          $rootScope.lastUpdate = data.last_update;
        });
      }, 10000);
    });
  }

  function setMonthTotal(){
    $http.get('http://smart-water.tk/api/report/monthTotalByUser/'+user.cpf).success(function(data) {
      $rootScope.monthCounter = data.total;
    });

    setTimeout(function() {
      setInterval(function() {
        $http.get('http://smart-water.tk/api/report/monthTotalByUser/'+user.cpf).success(function(data) {
          $rootScope.monthCounter = data.total;
        });
      }, 10000);
    });
  };

  //set counters
  setGeneralTotal();
  setMonthTotal();


})

.controller('userInfoCtrl', function($scope,$localstorage) {
  var user = $localstorage.getObject('user');
  $scope.user = user;
})

.controller('dailyReportCtrl', function($scope, $http, $localstorage) {

  //init controller
  var user = $localstorage.getObject('user');

  function listMonths($scope, $http, userCPF) {
    var monthNames = ["","January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

    var months = [];

    $http.get('http://smart-water.tk/api/report/getMonthsByUser/'+userCPF).success(function(data) {
      for (var i in data){
        months.push({'value' : data[i].month+"/"+data[i].year, 'description' : monthNames[data[i].month]+" "+data[i].year});
      }
      $scope.months = months;
    });
  }

  function setDailyCharts($scope, $http, userCPF, year, month){
    var monthNames = ["","January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

    monthTitle = monthNames[month] +" "+year;
    $http.get('http://smart-water.tk/api/report/daily/'+userCPF+"/"+year+"/"+month).success(function(months) {
      $scope.dailyCharts = {
        options: {
          title: {
            text: 'Daily consumption'
          },
          subtitle: {
            text: monthTitle
          }
        },
        xAxis: {
          categories: months.categories,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Flow (Liters)'
          },
          plotLines: [{
            label: {
              text: 'Average (' + months.average.toFixed(3) + ' liters)',
              align: 'left'
            },
            dashStyle: 'dash',
            color: 'green',
            value: months.average,
            width: '2',
            zIndex: 2
          }]
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">Day {point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true,
          valueSuffix: 'liters'
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [{
          name: 'Water',
          data: months.series
        }]
      }
    });
  }

.controller('monthlyReportCtrl', function($scope, $http, $localstorage) {

  //function to set Month Charts 
  function setMonthCharts($scope, $http, userCPF){
    $http.get('http://smart-water.tk/api/report/lastYear/'+userCPF).success(function(days) {
      $scope.monthCharts = {
        options: {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Consumption per month'
          },
          subtitle: {
            text: 'Last 12 months'
          }
        },
        xAxis: {
          categories: days.categories,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Flow (Liters)'
          },
          plotLines: [{
            label: {
              text: 'Average (' + days.average.toFixed(3) + ' liters)',
              align: 'left'
            },
            dashStyle: 'dash',
            color: 'green',
            value: days.average,
            width: '2',
            zIndex: 2
          }]
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true,
          valueSuffix: 'liters'
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [{
          name: 'Water (Liters)',
          data: days.series
        }]
      }
    });
  };

  //init charts
  var user = $localstorage.getObject('user');
  setMonthCharts($scope,$http,user.cpf);

})
