'use strict';

/**
 * @ngdoc function
 * @name garagebaerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the garagebaerApp
 */
angular.module('garagebaerApp')
    .controller('MainCtrl', function($scope, $interval, Restangular) {
        $scope.state = '';
        $scope.isDisabled = false;
        $scope.fetchState = function() {
            var apiState = Restangular.one('api/state');
            apiState.get().then(function(data) {
                $scope.state = data.state;
            });
        };

        $scope.fetchState();

        $interval(function() {
            $scope.fetchState();
        }, 3000);

        var oppositeState = function(s) {
            return (s.toUpperCase() === 'OPEN') ? 'CLOSED' : ((s.toUpperCase() === 'CLOSED') ? 'OPEN' :
                'CLOSED');
        };

        $scope.operateDoor = function() {
            var apiOperate = Restangular.one('api');
            $scope.isDisabled = true;

            apiOperate.post('operate', {
                state: oppositeState($scope.state)
            }).then(function(data) {
                $scope.state = data.state;
                $scope.isDisabled = false;
            });
        };


    });
