'use strict';

/**
 * @desc Displays a Spotify track, with play/pause functionality.
 * @example <div bop-finder-track ng-model="track"></div>
 */
angular
    .module('bopFinder')
    .directive('bopFinderTrack', BopFinderTrack);

function BopFinderTrack()
{

    return {
        templateUrl: 'views/track.html',
        restrict: 'EA'
    };
}
