'use strict';

/**
 * @ngdoc function
 * @name bopFinder.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bopFinder
 */
angular.module('bopFinder')
    .controller('MainCtrl', function($scope, $http, $window, markets, Spotify)
    {
        /* jshint validthis: true */
        var main = this;

        main.searchSelected = '';

        main.search = {};

        main.artist = '';

        main.topTracks = [];

        main.audio = {};
        main.current_audio = 0;

        var user = '';

        var createPlaylist = function()
        {
            var playlistName = '[BOP FINDER] ' + main.artist.name;
            Spotify.createPlaylist(user.id,
            {
                name: playlistName
            }).then(function(response)
            {

                Spotify.addPlaylistTracks(user.id, response.data.id, main.topTracks.map(function(track)
                {
                    return track.id;
                })).then(function(response)
                {
                    console.log(response);
                });

            });


        };


        main.logIn = function()
        {
            if (user === '' || user === null || user === undefined)
            {
                Spotify.login().then(function()
                {
                    Spotify.setAuthToken($window.localStorage.getItem('spotify-token'));
                    Spotify.getCurrentUser().then(function(response)
                    {
                        user = response.data;
                        createPlaylist();
                    });
                });
            }
            else if ($window.localStorage.getItem('spotify-token') !== null && (user === '' || user === null || user === undefined))
            {
                Spotify.setAuthToken($window.localStorage.getItem('spotify-token'));
                Spotify.getCurrentUser().then(function(response)
                {
                    user = response.data;
                    createPlaylist();
                });

            }
            else
            {
                createPlaylist();
            }

        };


        main.playAudio = function(track)
        {
            if (main.audio.duration > 0 && !main.audio.paused && track.id === main.current_audio)
            {
                main.audio.pause();
            }
            else if (main.audio.duration > 0 && main.audio.paused && track.id === main.current_audio)
            {
                main.audio.play();
            }
            else if (main.audio.duration > 0 && !main.audio.paused && track.id !== main.current_audio)
            {
                main.audio.pause();
                main.audio = new Audio(track.preview_url);
                main.audio.play();
                main.current_audio = track.id;
            }
            else
            {
                main.audio = new Audio(track.preview_url);
                main.audio.play();
                main.current_audio = track.id;
            }

        };

        main.selectCountry = function(country)
        {
            main.market = country;
            main.searchSelected = '';
            main.artist = '';
            main.topTracks = [];
            if (main.audio.duration > 0 && !main.audio.paused)
            {
                main.audio.pause();
            }
            main.audio = {};
            main.current_audio = 0;
        };


        main.getTracks = function(album)
        {
            var tracks = album.tracks.items.length > 50 ? 
                album.tracks.items.splice(0, 50).map(function(track){return track.id;}) : 
                album.tracks.items.map(function(track){return track.id;});
            Spotify.getTracks(tracks, {country: markets.current.Code}).then(function(response)
            {
                var track_list = response.data.tracks;
                track_list.sort(function(a, b)
                {
                    return b.popularity - a.popularity;
                });

                var percentile = Math.ceil(album.tracks.items.length * 0.15);

                for (var i = 0; i < percentile; i++)
                {
                    main.topTracks.push(track_list[i]);
                }
            });

        };

        main.onSelect = function($item)
        {
            main.artist = $item;
            Spotify.getArtistAlbums(main.artist.id,
            {
                album_type: 'album,single',
                country: markets.current.Code,
                limit: 20
            }).then(function(response)
            {
                Spotify.getAlbums(response.data.items.map(function(track){return track.id;}),
                {
                    country: markets.current.Code
                }).then(function(response)
                {
                    var albums = response.data.albums;
                    albums.sort(function(a, b)
                    {
                        return b.popularity - a.popularity;
                    });


                    var albums_filtered = {};

                    for (var i = 0; i < albums.length; i++)
                    {
                        if (albums[i].name.replace(/ *\([^)]*\) */g, '') in albums_filtered)
                        {
                            albums.splice(i, 1);
                        }
                        else
                        {
                            albums_filtered[albums[i].name.replace(/ *\([^)]*\) */g, '')] = 'exists';
                        }
                    }

                    var median = -1;
                    var q1 = -1;
                    var top, bottom;
                    if (albums.length % 2 === 0)
                    {
                        median = albums[albums.length / 2].popularity;
                        if (albums.length % 4 === 0)
                        {
                            q1 = albums[albums.length - (albums.length / 4)].popularity;
                        }
                        else
                        {
                            top = albums.length - Math.ceil(albums.length / 4);
                            bottom = albums.length - Math.floor(albums.length / 4);
                            if (top >= albums.length)
                            {
                                q1 = albums[bottom].popularity;
                            }
                            else
                            {
                                q1 = Math.floor((albums[top].popularity + albums[bottom].popularity) / 2);
                            }
                        }

                    }
                    else
                    {
                        top = Math.ceil(albums.length / 2);
                        bottom = Math.floor(albums.length / 2);
                        median = Math.floor((albums[top].popularity + albums[bottom].popularity) / 2);

                        top = albums.length - Math.ceil(albums.length / 4);
                        bottom = albums.length - Math.floor(albums.length / 4);
                        if (top >= albums.length)
                        {
                            q1 = albums[bottom].popularity;
                        }
                        else
                        {
                            q1 = Math.floor((albums[top].popularity + albums[bottom].popularity) / 2);
                        }
                    }
                    var offset = 0;
                    main.topTracks = [];
                    for (var j = 0; j < albums.length; j++)
                    {
                        if ((albums[j].album_type === 'single' && albums[j].popularity > median) || (albums[j].album_type === 'album' && albums[j].popularity > q1))
                        {
                            setTimeout(main.getTracks(albums[j]), 1000 + offset);
                            offset += 2000;
                        }

                    }


                });
            });

        };

        main.getArtist = function(val)
        {
            return Spotify.search(val.replace(' ', '+'), 'artist', {country: markets.current.Code}).then(function(response){
                return response.data.artists.items;
            });

        };
    });
