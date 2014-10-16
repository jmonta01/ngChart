'use strict';

/**
 * @ngdoc function
 * @name ngChartApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngChartApp
 */
angular.module('ngChartApp')
    .controller('MainCtrl', ['$scope',
        function ($scope) {
            $scope.data = [];

            $scope.bounds = {
                x: { min: 0, max: 50, offset: 1},
                y: { min: 0, max: 100, offset: 1}
            };
            $scope.fields =  { x: 'id', y: 'value' };

            $scope.labelFns = {
                x: function (item) {
                    return item;
//                    var d = new Date(item);
//                    return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear().toString().substr(2,2);
                },
                y: function (item) {
                    return item + '%';
                }
            };

            var generateData = function (index) {
                var date = new Date();
                date.setTime(date.getTime() - (index * 24 * 60 * 60 * 1000));
                return {
                    id: index,
                    value: Math.random() * $scope.bounds.y.max,
                    date: date
                };
            };

            for (var i=0; i<=50; i++) {
                $scope.data.push(generateData(i));
            }



        }
    ]);
