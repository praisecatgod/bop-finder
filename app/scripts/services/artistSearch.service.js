'use strict';

function ArtistSearch($http, $log, Spotify, markets)
{

    var artistSearch = this;

    artistSearch.search = function(val)
    {

        function searchComplete(response)
        {
            return response.data.artists.items;
        }

        function searchFailed(error)
        {
            $log.error('XHR Failed for ArtistSearch search.' + error.data);
            return [];
        }
        return Spotify.search(val.trim(), 'artist',
            {
                country: markets.current.code
            })
            .then(searchComplete)
            .catch(searchFailed);

    };

}

/**
 * @desc Searches Spotify API for an artist, and retrieves list.
 */
angular
    .module('bopFinder')
    .service('artistSearch', ArtistSearch);

ArtistSearch.$inject = ['$http', '$log', 'Spotify', 'markets'];
