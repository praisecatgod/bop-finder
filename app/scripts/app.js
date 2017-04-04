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
    .directive('bopFinderTrack', function()
    {
        return {
            templateUrl: 'views/track.html'
        };
    })
    .directive('bopFinderFooter', function()
    {
        return {
            templateUrl: 'views/footer.html'
        };
    })
    .directive('bopFinderNavbar', function()
    {
        return {
            templateUrl: 'views/navbar.html',
            controller: 'NavCtrl',
            controllerAs: 'nav'
        };
    })
    .service('markets', function Markets($http)
    {
        var markets = this;

        markets.current = {
            'name': 'united states',
            'code': 'us'
        };

        $http.get('scripts/countries.json').then(function(response)
        {
            markets.countries = response.data;
        });

    })
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
            .when('/callback',
            {
                templateUrl: 'views/callback.html'
            })
            .otherwise(
            {
                redirectTo: '/'
            });

        SpotifyProvider.setClientId('c8b41b06c1734f0987f8ee45de21ad32');
        SpotifyProvider.setRedirectUri('views/callback.html');
        SpotifyProvider.setScope('user-read-private playlist-modify playlist-modify-private');
    });
