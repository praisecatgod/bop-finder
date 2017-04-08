'use strict';

/**
 * @ngdoc function
 * @name bopFinder.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the bopFinder
 */
angular.module('bopFinder')
    .controller('NavCtrl', function(markets)
    {

        var nav = this;

        nav.markets = [];



        function activateMarkets()
        {
            return getMarkets();
        }

        function getMarkets()
        {
            return markets.getMarkets()
                .then(function(data)
                {
                    nav.markets.countries = data;
                    return nav.markets.countries;
                });
        }

        function activateMarketByIP()
        {
            return getMarketByIP();
        }

        function getMarketByIP()
        {
            return markets.getMarketByIP()
                .then(function(data)
                {
                    nav.markets.current = data;
                    markets.setCurrent(data);
                    return nav.markets.current;
                });
        }

        activateMarkets();
        activateMarketByIP();

        nav.selectCountry = function(country)
        {
            markets.setCurrent(country);
        };


    });
