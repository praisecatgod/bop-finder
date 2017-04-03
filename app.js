var bopFinder = angular.module('bopFinder', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

bopFinder
    .directive('bopFinderTrack', function()
    {
        return {
            templateUrl: 'track.html'
        };
    });

bopFinder
    .directive('bopFinderFooter', function()
    {
        return {
            templateUrl: 'footer.html'
        };
    });

bopFinder
    .directive('bopFinderNavbar', function()
    {
        return {
            templateUrl: 'navbar.html'
        };
    });

bopFinder
    .controller('MainCtrl', [
        '$scope', '$http',
        function($scope, $http)
        {

            var CLIENT_ID = 'c8b41b06c1734f0987f8ee45de21ad32';
            var REDIRECT_URI = 'http://localhost:8080/callback';

            $scope.countries = [];

            $http.get("countries.json").then(function(response)
            {
                $scope.countries = response.data;
            });

            $scope.market = {
                "Name": "United States",
                "Code": "US"
            };

            $scope.searchSelected = '';

            $scope.search = {};

            $scope.artist = '';

            $scope.topTracks = [];

            $scope.audio = {};
            $scope.current_audio = 0;

            function getLoginURL(scopes)
            {
                return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
                    '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
                    '&scope=' + encodeURIComponent(scopes.join(' ')) +
                    '&response_type=token';
            }



            $scope.logIn = function()
            {

                var url = getLoginURL([
                    'user-read-email'
                ]);

                var width = 450,
                    height = 730,
                    left = (screen.width / 2) - (width / 2),
                    top = (screen.height / 2) - (height / 2);

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
                if($scope.audio.duration > 0 && !$scope.audio.paused){
                    $scope.audio.pause();
                }
                $scope.audio = {};
                $scope.current_audio = 0;
            };

            var getTrack = function(trackIDs)
            {
                return $http.get("https://api.spotify.com/v1/tracks?ids=" + trackIDs + "&market=" + $scope.market.Code).then(function(response)
                {
                    return response.data.tracks;
                });
            };

            $scope.getTracks = function(album)
            {
                tracks = album.tracks.items;
                Promise.resolve(
                    getTrack(tracks.map(function(track)
                    {
                        return track.id
                    }).join())
                ).then(function(track_list)
                {
                    track_list.sort(function(a, b)
                    {
                        return b.popularity - a.popularity;
                    });

                    var percentile = Math.ceil(track_list.length * .15);

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
                $http.get("https://api.spotify.com/v1/artists/" + $scope.artist.id + "/albums?market=" + $scope.market.Code + "&album_type=album,single").then(function(response)
                {
                    Promise.all(response.data.items.map(function(album)
                    {
                        return $http.get("https://api.spotify.com/v1/albums/" + album.id + "?market=" + $scope.market.Code).then(function(response)
                        {
                            return response.data;
                        });

                    })).then(function(albums)
                    {
                        albums.sort(function(a, b)
                        {
                            return b.popularity - a.popularity;
                        });


                        albums_filtered = {};

                        for (var i = 0; i < albums.length; i++)
                        {
                            if (albums[i].name.replace(/ *\([^)]*\) */g, "") in albums_filtered)
                            {
                                albums.splice(i, 1);
                            }
                            else
                            {
                                albums_filtered[albums[i].name.replace(/ *\([^)]*\) */g, "")] = "exists";
                            }
                        }

                        var median = -1;
                        var q1 = -1;
                        if (albums.length % 2 == 0)
                        {
                            median = albums[albums.length / 2].popularity;
                            if (albums.length % 4 == 0)
                            {
                                q1 = albums[albums.length - (albums.length / 4)].popularity;
                            }
                            else
                            {
                                var top = albums.length - Math.ceil(albums.length / 4);
                                var bottom = albums.length - Math.floor(albums.length / 4);
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
                            var top = Math.ceil(albums.length / 2);
                            var bottom = Math.floor(albums.length / 2);
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
                        for (var i = 0; i < albums.length; i++)
                        {
                            if ((albums[i].album_type == 'single' && albums[i].popularity > median) || (albums[i].album_type == 'album' && albums[i].popularity > q1))
                            {
                                setTimeout($scope.getTracks(albums[i]), 1000 + offset);
                                offset += 2000;
                            }

                        }


                    });
                });

            };

            $scope.getArtist = function(val)
            {
                return $http.get("https://api.spotify.com/v1/search?q=" + val.replace(" ", "+") + "&type=artist&market=" + $scope.market.Code).then(function(response)
                {
                    return response.data.artists.items;
                });

            };


        }
    ]);
