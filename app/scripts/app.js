'use strict';

/**
 * @ngdoc ov
erview
 * @name bopFinder
 * @description
 * # bopFinder
 *
 * Main module of the application.
 */
angular
    .module('bopFinder', [
        'ngAnimate',
        'ngRoute',
        'ngSanitize',
        'ui.bootstrap',
        'spotify'
    ])
    .config(function($locationProvider, $routeProvider, SpotifyProvider)
    {
        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/',
            {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/about',
            {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .otherwise(
            {
                redirectTo: '/'
            });

        SpotifyProvider.setClientId('c8b41b06c1734f0987f8ee45de21ad32');
        SpotifyProvider.setRedirectUri('views/callback.html');
        SpotifyProvider.setScope('user-read-private playlist-modify playlist-modify-private');
    });
