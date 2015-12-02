'use strict';

/**
 * @ngdoc function
 * @name garagebaerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the garagebaerApp
 */
angular.module('garagebaerApp')
    .controller('MainCtrl', function($scope, Restangular) {
        var apiState = Restangular.one('api/state');
        $scope.isDisabled = false;

        $scope.operateDoor = function() {
            var apiOperate = Restangular.one('api/operate');
            $scope.isDisabled = true;

            apiOperate.post().then(function(data) {
                $scope.state = data.state;
                $scope.isDisabled = false;
            });
        };

        apiState.get().then(function(data) {
            $scope.state = data.state;
        });
    });
