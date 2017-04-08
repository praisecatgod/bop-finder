'use strict';

function Music()
{
    var music = this;
    music.audio = {};
    music.track_id = -1;

    music.play = function(track)
    {
        if (music.audio.duration > 0 && !music.audio.paused && track.id === music.track_id)
        {
            music.audio.pause();
        }
        else if (music.audio.duration > 0 && music.audio.paused && track.id === music.track_id)
        {
            music.audio.play();
        }
        else if (music.audio.duration > 0 && !music.audio.paused && track.id !== music.track_id)
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

}

/**
 * @desc Plays, pauses, and keeps track of audio for the page.
 */
angular
    .module('bopFinder')
    .service('music', Music);