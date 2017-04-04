'use strict';

/**
 * @ngdoc function
 * @name bopFinder.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the bopFinder
 */
angular.module('bopFinder')
  .controller('NavCtrl', function (markets) {

    var nav = this;

    nav.markets = markets;

    nav.selectCountry = function(country){
      nav.markets.current = country;
    };


  });
