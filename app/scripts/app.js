'use strict';

/**
 * @ngdoc overview
 * @name ngChartApp
 * @description
 * # ngChartApp
 *
 * Main module of the application.
 */
angular
    .module('ngChartApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .constant('d3', window.d3)
    .constant('under', window._)
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
