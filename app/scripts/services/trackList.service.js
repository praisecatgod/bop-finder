'use strict';

function TrackList($log, Spotify, markets, stats)
{

    var trackList = this;
    //var topTracks = [];

    //var albums = [];

    trackList.getTopTracks = function(artist_id)
    {
        getArtistAlbums(artist_id, 0).then(getAlbums).then(getTracks);

    };


    function getArtistAlbums(artist_id, offset)
    {

        function getArtistAlbumsComplete(response)
        {
            var albums = response.data.items.map(function(a)
            {
                return a.id;
            });

            function combineAlbums(response)
            {
                return albums.concat(response);
            }
            if (offset + 50 <= response.data.total)
            {
                return getArtistAlbums(artist_id, offset + 50).then(combineAlbums);
            }
            else
            {
                return albums;
            }
        }

        function getArtistAlbumsFailed(error)
        {
            $log.error(error);
        }
        return Spotify.getArtistAlbums(artist_id,
            {
                album_type: 'album,single',
                country: markets.current.code,
                offset: offset,
                limit: 50
            })
            .then(getArtistAlbumsComplete)
            .catch(getArtistAlbumsFailed);
    }

    /* function getTracks(album_ids)
     {
         for (var i = 0; i < album_ids.length; i += 20)
         {
             getAlbums(album_ids.slice(i, i + 20));
         }

     }*/

    function getAlbums(album_ids)
    {
        function getAlbumsComplete(response)
        {
            var albums = response.data.albums;

            function combineAlbums(response)
            {
                return albums.concat(response);
            }
            if (album_ids.length > 20)
            {
                album_ids.splice(0, 20);
                return getAlbums(album_ids).then(combineAlbums);
            }
            else
            {
                return albums;
            }

        }

        function getAlbumsFailed(error)
        {
            $log.error(error);
            return [];
        }
        return Spotify.getAlbums(album_ids.slice(0, 20),
            {
                country: markets.current.code
            })
            .then(getAlbumsComplete)
            .catch(getAlbumsFailed);
    }

    function getTracks(albums)
    {
        function popularityRank(a1, a2){
            return a2.popularity - a1.popularity;
        }

        albums.sort(popularityRank);
        var album_popularities = albums.map(function(a){return a.popularity});
        $log.info(album_popularities);
        $log.info(albums);
    }

}

/**
 * @desc Retrieves the top tracks of an artist;
 */
angular
    .module('bopFinder')
    .service('trackList', TrackList);

TrackList.$inject = ['$log', 'Spotify', 'markets', 'stats'];
