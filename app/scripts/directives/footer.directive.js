'use strict';

/**
 * @desc Displays the footer.
 * @example <bop-finder-footer></bop-finder-footer>
 */
angular
    .module('bopFinder')
    .directive('bopFinderFooter', BopFinderFooter);

function BopFinderFooter()
{

    return {
        templateUrl: 'views/footer.html',
        restrict: 'EA'
    };
}
