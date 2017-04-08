'use strict';

function Markets($http, $log)
{

    var markets = {};

    markets.getMarketByIP = function()
    {

        function getMarketByIPComplete(response)
        {
            return {
                country: (response.data.country).toLowerCase(),
                code: (response.data.countryCode).toLowerCase()
            };
        }

        function getMarketByIPFailed(error)
        {
            $log.error(error);
            $log.warn('XHR Failed for getMarketByIP. Loading default as US.');

            return {
                country: 'united states',
                code: 'us'
            };
        }

        return $http.get('http://ip-api.com/json')
            .then(getMarketByIPComplete)
            .catch(getMarketByIPFailed);

    };

    markets.getMarkets = function()
    {

        function getMarketsComplete(response)
        {
            return response.data;
        }

        function getMarketsFailed(error)
        {
            $log.error(error);
            $log.error('XHR Failed for getMarkets.');
            return [];
        }
        return $http.get('scripts/countries.json')
            .then(getMarketsComplete)
            .catch(getMarketsFailed);
    };

    markets.setCurrent = function(country){
      markets.current = country;

    };

    markets.getCurrent = function(){
      return markets.current;

    };

    return markets;


}

/**
 * @desc Controls the flag drop-down market selection.
 */
angular
    .module('bopFinder')
    .factory('markets', Markets);

Markets.$inject = ['$http', '$log'];
