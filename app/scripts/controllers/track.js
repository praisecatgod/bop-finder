'use strict';

/**
 * @ngdoc function
 * @name bopFinder.controller:TrackCtrl
 * @description
 * # TrackCtrl
 * Controller of the bopFinder
 */
angular.module('bopFinder')
  .controller('TrackCtrl', function (music) {

    var track = this;

    track.playAudio = function(track)
        {
            if (music.audio.duration > 0 && !music.audio.paused && track.id === music.track_id)
            {
                music.audio.pause();
            }
            else if (music.audio.duration > 0 && music.audio.paused && track.id === music.track_id)
            {
                music.audio.play();
            }
            else if (music.audio.duration > 0 && !music.musicaudio.paused && track.id !== music.track_id)
            {
                music.audio.pause();
                music.audio = new Audio(track.preview_url);
                music.audio.play();
                music.track_id = track.id;
            }
            else
            {
                music.audio = new Audio(track.preview_url);
                music.audio.play();
                music.track_id = track.id;
            }

        };


  });
