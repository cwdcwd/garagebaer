'use strict';

/**
 * @ngdoc overview
 * @name garagebaerApp
 * @description
 * # garagebaerApp
 *
 * Main module of the application.
 */
angular
    .module('garagebaerApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'restangular'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
