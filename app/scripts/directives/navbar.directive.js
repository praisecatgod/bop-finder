'use strict';

/**
 * @desc Displays the navbar, with country select functionality.
 * @example <bop-finder-navbar></bop-finder-navbar>
 */
angular
    .module('bopFinder')
    .directive('bopFinderNavbar', BopFinderNavbar);

function BopFinderNavbar()
{

    return {
        templateUrl: 'views/navbar.html',
        controller: 'NavCtrl',
        controllerAs: 'nav',
        bindToController: true,
        restrict: 'EA'
    };
}
