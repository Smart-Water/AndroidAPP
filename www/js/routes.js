angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('smartWater', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })

    .state('menu', {
      url: '/menu',
      abstract:true,
      templateUrl: 'templates/menu.html'
    })

    .state('menu.dashboard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'dashboardCtrl'
        }
      }
    })

    .state('menu.userInfo', {
      url: '/userInfo',
      views: {
        'menuContent': {
          templateUrl: 'templates/userInfo.html',
          controller: 'userInfoCtrl'
        }
      }
    })

    .state('menu.dailyReport', {
      url: '/dailyReport',
      views: {
        'menuContent': {
          templateUrl: 'templates/dailyReport.html',
          controller: 'dailyReportCtrl'
        }
      }
    })

    .state('menu.monthlyReport', {
      url: '/monthlyReport',
      views: {
        'menuContent': {
          templateUrl: 'templates/monthlyReport.html',
          controller: 'monthlyReportCtrl'
        }
      }
    })

    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
