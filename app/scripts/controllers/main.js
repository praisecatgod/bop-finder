'use strict';

/**
 * @ngdoc function
 * @name bopFinder.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bopFinder
 */
angular.module('bopFinder')
    .controller('MainCtrl', function($scope, $http, $window, Spotify)
    {
        /* jshint validthis: true */
        //var vm = this;

        $scope.countries = [];

        $http.get('countries.json').then(function(response)
        {
            $scope.countries = response.data;
        });

        $scope.market = {
            'Name': 'United States',
            'Code': 'US'
        };

        $scope.searchSelected = '';

        $scope.search = {};

        $scope.artist = '';

        $scope.topTracks = [];

        $scope.audio = {};
        $scope.current_audio = 0;

        var user = '';

        var createPlaylist = function()
        {
            var playlistName = '[BOP FINDER] ' + $scope.artist.name;
            Spotify.createPlaylist(user.id,
            {
                name: playlistName
            }).then(function(response)
            {

                Spotify.addPlaylistTracks(user.id, response.data.id, $scope.topTracks.map(function(track)
                {
                    return track.id;
                })).then(function(response)
                {
                    console.log(response);
                });

            });


        };


        $scope.logIn = function()
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


        $scope.playAudio = function(track)
        {
            if (!track.is_playable)
            {
                return;
            }
            else if ($scope.audio.duration > 0 && !$scope.audio.paused && track.id === $scope.current_audio)
            {
                $scope.audio.pause();
            }
            else if ($scope.audio.duration > 0 && $scope.audio.paused && track.id === $scope.current_audio)
            {
                $scope.audio.play();
            }
            else if ($scope.audio.duration > 0 && !$scope.audio.paused && track.id !== $scope.current_audio)
            {
                $scope.audio.pause();
                $scope.audio = new Audio(track.preview_url);
                $scope.audio.play();
                $scope.current_audio = track.id;
            }
            else
            {
                $scope.audio = new Audio(track.preview_url);
                $scope.audio.play();
                $scope.current_audio = track.id;
            }

        };

        $scope.selectCountry = function(country)
        {
            $scope.market = country;
            $scope.searchSelected = '';
            $scope.artist = '';
            $scope.topTracks = [];
            if ($scope.audio.duration > 0 && !$scope.audio.paused)
            {
                $scope.audio.pause();
            }
            $scope.audio = {};
            $scope.current_audio = 0;
        };

        var getTrack = function(trackIDs)
        {
            return $http.get('https://api.spotify.com/v1/tracks?ids=' + trackIDs + '&market=' + $scope.market.Code).then(function(response)
            {
                return response.data.tracks;
            });
        };

        $scope.getTracks = function(album)
        {
            var tracks = album.tracks.items;
            Promise.resolve(
                getTrack(tracks.map(function(track)
                {
                    return track.id;
                }).join())
            ).then(function(track_list)
            {
                track_list.sort(function(a, b)
                {
                    return b.popularity - a.popularity;
                });

                var percentile = Math.ceil(track_list.length * 0.15);

                for (var i = 0; i < percentile; i++)
                {
                    $scope.topTracks.push(track_list[i]);
                    $scope.$apply();
                }
            });

        };

        $scope.onSelect = function($item)
        {
            $scope.artist = $item;
            Spotify.getArtistAlbums($scope.artist.id,
            {
                album_type: 'album,single',
                country: $scope.market.Code,
                limit: 20
            }).then(function(response)
            {
                Spotify.getAlbums(response.data.items.map(function(track){return track.id;}),
                {
                    country: $scope.market.Code
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
                    $scope.topTracks = [];
                    for (var j = 0; j < albums.length; j++)
                    {
                        if ((albums[j].album_type === 'single' && albums[j].popularity > median) || (albums[j].album_type === 'album' && albums[j].popularity > q1))
                        {
                            setTimeout($scope.getTracks(albums[j]), 1000 + offset);
                            offset += 2000;
                        }

                    }


                });
            });

        };

        $scope.getArtist = function(val)
        {
            return $http.get('https://api.spotify.com/v1/search?q=' + val.replace(' ', '+') + '&type=artist&market=' + $scope.market.Code).then(function(response)
            {
                return response.data.artists.items;
            });

        };
    });
